import { serve } from 'bun';
import { afterAll, afterEach, describe, expect, it, mock, spyOn } from 'bun:test';
import { http, https } from 'follow-redirects';
import { PassThrough } from 'stream';

import { getRejection } from '../test/getRejection';
import { startAbortingServer } from '../test/startAbortingServer';

import { downloadHtml } from './downloadHtml';

const PAGE = '<html><body>strona główna</body></html>';
const PAGE_BYTES = Buffer.from(PAGE);
const BYTE_INSIDE_MULTIBYTE_CHARACTER = PAGE_BYTES.indexOf(Buffer.from('ó')) + 1;

const server = serve({ fetch: respond, port: 0 });
const origin = server.url.origin;
const realHttpGet = http.get.bind(http);

afterEach(() => {
  mock.restore();
});

afterAll(() => server.stop(true));

describe('downloadHtml', () => {
  it('returns the page as text', async () => {
    expect(await downloadHtml(`${origin}/page`)).toBe(PAGE);
  });

  it('decodes a character split across two chunks', async () => {
    const response = new PassThrough();
    spyOn(http, 'get').mockImplementation(answerWith(response));

    const html = downloadHtml('http://words.example/page');
    response.write(PAGE_BYTES.subarray(0, BYTE_INSIDE_MULTIBYTE_CHARACTER));
    response.end(PAGE_BYTES.subarray(BYTE_INSIDE_MULTIBYTE_CHARACTER));

    expect(await html).toBe(PAGE);
  });

  it('returns an empty string for an empty page', async () => {
    expect(await downloadHtml(`${origin}/empty`)).toBe('');
  });

  it('follows redirects', async () => {
    expect(await downloadHtml(`${origin}/moved`)).toBe(PAGE);
  });

  it('rejects when the connection drops in the middle of the page', async () => {
    const url = await startAbortingServer('<html>');

    expect((await getRejection(downloadHtml(url))).message).toContain('aborted');
  });

  it('fetches https urls through the https client', async () => {
    const httpsGet = spyOn(https, 'get').mockImplementation(forwardToLocalPage as unknown as typeof https.get);
    const httpGet = spyOn(http, 'get');
    const url = 'https://words.example/page';

    expect(await downloadHtml(url)).toBe(PAGE);
    expect(httpsGet.mock.calls.map(([requestedUrl]) => requestedUrl)).toEqual([url] as never);
    expect(httpGet).not.toHaveBeenCalled();
  });

  it('fetches http urls through the http client', async () => {
    const httpsGet = spyOn(https, 'get').mockImplementation(forwardToLocalPage as unknown as typeof https.get);
    const httpGet = spyOn(http, 'get');
    const url = `${origin}/page`;

    await downloadHtml(url);

    expect(httpGet.mock.calls.map(([requestedUrl]) => requestedUrl)).toEqual([url] as never);
    expect(httpsGet).not.toHaveBeenCalled();
  });

  it.todo('rejects when the connection is refused');
});

function respond(request: Request): Response {
  switch (new URL(request.url).pathname) {
    case '/empty':
      return new Response('');
    case '/moved':
      return new Response(null, { headers: { Location: '/page' }, status: 302 });
    case '/page':
      return new Response(PAGE);
    default:
      return new Response('Not Found', { status: 404 });
  }
}

function answerWith(response: PassThrough) {
  function get(_url: string, callback: (response: PassThrough) => void) {
    callback(response);
  }

  return get as unknown as typeof http.get;
}

function forwardToLocalPage(_url: string, callback: Parameters<typeof http.get>[1]) {
  return realHttpGet(`${origin}/page`, callback);
}
