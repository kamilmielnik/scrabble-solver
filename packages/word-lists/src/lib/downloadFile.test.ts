/* eslint-disable max-lines */
import { serve } from 'bun';
import { afterAll, afterEach, describe, expect, it, mock, spyOn } from 'bun:test';
import { http, https } from 'follow-redirects';
import { readFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { dirname } from 'path';
import { PassThrough } from 'stream';

import { getRejection } from '../test/getRejection';
import { installTempFileSandbox } from '../test/installTempFileSandbox';
import { shortenDownloadTimeout } from '../test/shortenDownloadTimeout';
import { startAbortingServer } from '../test/startAbortingServer';
import { startStallingServer } from '../test/startStallingServer';

import type * as downloadFileModule from './downloadFile';

const tempFiles = installTempFileSandbox();
const { downloadFile }: typeof downloadFileModule = await import('./downloadFile');

const REFUSED_URL = 'http://127.0.0.1:1/file';
const BINARY_BODY = Buffer.from([0x00, 0xff, 0xfe, 0x80, 0x0d, 0x0a]);
const LARGE_BODY = Buffer.alloc(1024 * 1024, 'word\n');
const STALLED_BODY = 'HTTP/1.1 200 OK\r\nContent-Length: 1000\r\n\r\npartial';
const REDIRECTS: Record<string, string> = {
  '/moved-permanently': '/file',
  '/moved-temporarily': '/file',
  '/moved-twice': '/moved-temporarily',
  '/moved-to-missing-file': '/missing',
  '/redirect-loop': '/redirect-loop',
};

const server = serve({ fetch: respond, port: 0 });
const origin = server.url.origin;
const realHttpGet = http.get.bind(http);

afterEach(() => {
  mock.restore();
});

afterAll(() => server.stop(true));

describe('downloadFile', () => {
  it('saves the response body to a temp file and returns its path', async () => {
    const filepath = await downloadFile(`${origin}/file`);

    expect(readFileSync(filepath, 'utf-8')).toBe('aa\nab\n');
  });

  it('keeps the temp file inside the sandboxed temp directory', async () => {
    const filepath = await downloadFile(`${origin}/file`);

    expect(dirname(filepath)).toBe(tempFiles.directory);
    expect(filepath).toStartWith(tmpdir());
  });

  it('uses a separate temp file for every download', async () => {
    const first = await downloadFile(`${origin}/file`);
    const second = await downloadFile(`${origin}/file`);

    expect(first).not.toBe(second);
    expect(tempFiles.listFiles()).toHaveLength(2);
  });

  it('preserves binary bytes', async () => {
    const filepath = await downloadFile(`${origin}/binary`);

    expect(readFileSync(filepath).equals(BINARY_BODY)).toBe(true);
  });

  it('resolves only after a body spanning many chunks is fully on disk', async () => {
    const filepath = await downloadFile(`${origin}/large`);

    expect(readFileSync(filepath).equals(LARGE_BODY)).toBe(true);
  });

  it('saves an empty file for an empty body', async () => {
    const filepath = await downloadFile(`${origin}/empty`);

    expect(readFileSync(filepath, 'utf-8')).toBe('');
  });

  it.each(['/moved-permanently', '/moved-temporarily', '/moved-twice'])('follows the redirect of %s', async (path) => {
    const filepath = await downloadFile(`${origin}${path}`);

    expect(readFileSync(filepath, 'utf-8')).toBe('aa\nab\n');
  });

  it('rejects when a redirect leads to a missing file', async () => {
    expect((await getRejection(downloadFile(`${origin}/moved-to-missing-file`))).message).toContain(
      'Cannot download file',
    );
  });

  it('rejects when redirects never end', async () => {
    expect((await getRejection(downloadFile(`${origin}/redirect-loop`))).message).toContain(
      'Maximum number of redirects exceeded',
    );
  });

  it('treats a 399 response as a success', async () => {
    const filepath = await downloadFile(`${origin}/status/399`);

    expect(readFileSync(filepath, 'utf-8')).toBe('status body');
  });

  it.each([400, 404, 500, 503])('rejects with the url when the server answers %i', async (status) => {
    const url = `${origin}/status/${status}`;

    expect((await getRejection(downloadFile(url))).message).toContain(`Cannot download file: ${url}`);
  });

  it('rejects when a response carries no status code', async () => {
    spyOn(http, 'get').mockImplementation(answerWithoutStatusCode as unknown as typeof http.get);

    expect((await getRejection(downloadFile('http://words.example/file'))).message).toContain('Cannot download file');
  });

  it('rejects when the connection is refused', async () => {
    expect((await getRejection(downloadFile(REFUSED_URL))).message).toContain('ECONNREFUSED');
  });

  it('rejects when the connection drops in the middle of the body', async () => {
    const url = await startAbortingServer('partial');

    expect((await getRejection(downloadFile(url))).message).toContain('aborted');
  });

  it('fetches https urls through the https client', async () => {
    const httpsGet = spyOn(https, 'get').mockImplementation(forwardToLocalFile as unknown as typeof https.get);
    const httpGet = spyOn(http, 'get');
    const url = 'https://words.example/file';

    const filepath = await downloadFile(url);

    expect(readFileSync(filepath, 'utf-8')).toBe('aa\nab\n');
    expect(httpsGet.mock.calls.map(([requestedUrl]) => requestedUrl)).toEqual([url] as never);
    expect(httpGet).not.toHaveBeenCalled();
  });

  it('fetches http urls through the http client', async () => {
    const httpsGet = spyOn(https, 'get').mockImplementation(forwardToLocalFile as unknown as typeof https.get);
    const httpGet = spyOn(http, 'get');
    const url = `${origin}/file`;

    await downloadFile(url);

    expect(httpGet.mock.calls.map(([requestedUrl]) => requestedUrl)).toEqual([url] as never);
    expect(httpsGet).not.toHaveBeenCalled();
  });

  it('removes the temp file when the server answers with an error status', async () => {
    await downloadFile(`${origin}/status/404`).catch(() => undefined);

    expect(tempFiles.listFiles()).toEqual([]);
  });

  it('removes the temp file when the connection is refused', async () => {
    await downloadFile(REFUSED_URL).catch(() => undefined);

    expect(tempFiles.listFiles()).toEqual([]);
  });

  it('removes the temp file when the connection drops in the middle of the body', async () => {
    const url = await startAbortingServer('partial');

    await downloadFile(url).catch(() => undefined);

    expect(tempFiles.listFiles()).toEqual([]);
  });

  it('rejects and leaves nothing behind when the temp file cannot be created', async () => {
    rmSync(tempFiles.directory, { force: true, recursive: true });

    expect((await getRejection(downloadFile(`${origin}/file`))).message).toContain('ENOENT');
  });
});

describe('downloadFile deadline', () => {
  it('gives up on a server that never answers', async () => {
    shortenDownloadTimeout();

    expect(await getRejection(downloadFile(await startStallingServer()))).toBeInstanceOf(Error);
  });

  it('gives up on a server that stops in the middle of the body and removes the partial file', async () => {
    shortenDownloadTimeout();
    const url = await startStallingServer(STALLED_BODY);

    expect(await getRejection(downloadFile(url))).toBeInstanceOf(Error);
    expect(tempFiles.listFiles()).toEqual([]);
  });
});

function respond(request: Request): Response {
  const { pathname } = new URL(request.url);
  const redirectTarget = REDIRECTS[pathname];

  if (redirectTarget) {
    const status = pathname === '/moved-permanently' ? 301 : 302;
    return new Response(null, { headers: { Location: redirectTarget }, status });
  }

  if (pathname.startsWith('/status/')) {
    return new Response('status body', { status: Number(pathname.split('/').at(-1)) });
  }

  switch (pathname) {
    case '/binary':
      return new Response(BINARY_BODY);
    case '/empty':
      return new Response('');
    case '/file':
      return new Response('aa\nab\n');
    case '/large':
      return new Response(LARGE_BODY);
    default:
      return new Response('Not Found', { status: 404 });
  }
}

function answerWithoutStatusCode(_url: string, _options: unknown, callback: (response: PassThrough) => void) {
  queueMicrotask(() => {
    callback(new PassThrough());
  });
  return { on: () => undefined };
}

function forwardToLocalFile(_url: string, _options: unknown, callback: Parameters<typeof http.get>[1]) {
  return realHttpGet(`${origin}/file`, callback);
}
