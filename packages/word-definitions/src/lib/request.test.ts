import { type Server, serve } from 'bun';
import { afterAll, beforeAll, beforeEach, describe, expect, it, mock } from 'bun:test';
import { EventEmitter } from 'events';
import type { IncomingHttpHeaders } from 'http';
import { PassThrough } from 'stream';

import type * as requestModule from './request';

type OnResponse = (response: PassThrough) => void;

const { http: realHttp } = await import('follow-redirects');

const httpGet = mock((...args: Parameters<typeof realHttp.get>) => realHttp.get(...args));
const httpsGet = mock<(options: object, onResponse: OnResponse) => EventEmitter>();

await mock.module('follow-redirects', () => ({ http: { get: httpGet }, https: { get: httpsGet } }));

const { request }: typeof requestModule = await import('./request');

const encoder = new TextEncoder();
const POLISH_TEXT = 'zażółć gęślą jaźń';
const PERSIAN_TEXT = 'کتاب';

let server: Server<undefined>;
let port: number;

beforeAll(() => {
  server = serve({
    hostname: '127.0.0.1',
    port: 0,
    routes: {
      '/chunks': () => new Response(streamOf('first ', 'second ', 'third')),
      '/empty': () => new Response(''),
      '/headers': (incoming) => new Response(incoming.headers.get('x-word')),
      '/hello': () => new Response('hello'),
      '/moved': () => new Response(null, { headers: { Location: '/hello' }, status: 302 }),
      '/not-found': () => new Response('{"status":404}', { status: 404 }),
      '/utf8': () => new Response(`${POLISH_TEXT} ${PERSIAN_TEXT}`),
    },
    fetch: () => new Response('unexpected path', { status: 500 }),
  });
  port = Number(server.port);
});

afterAll(async () => {
  await server.stop(true);
});

beforeEach(() => {
  httpGet.mockClear();
  httpsGet.mockReset();
});

describe('request', () => {
  describe('over http', () => {
    it('uses the http agent when no protocol is given', async () => {
      expect(await request({ hostname: '127.0.0.1', path: '/hello', port })).toBe('hello');
      expect(httpGet).toHaveBeenCalledTimes(1);
      expect(httpsGet).not.toHaveBeenCalled();
    });

    it('uses the http agent when the protocol is http', async () => {
      expect(await request({ hostname: '127.0.0.1', path: '/hello', port, protocol: 'http' })).toBe('hello');
      expect(httpGet).toHaveBeenCalledTimes(1);
      expect(httpsGet).not.toHaveBeenCalled();
    });

    it('joins a body that arrives in many chunks', async () => {
      expect(await request({ hostname: '127.0.0.1', path: '/chunks', port })).toBe('first second third');
    });

    it('decodes the body as utf-8', async () => {
      const body = await request({ hostname: '127.0.0.1', path: '/utf8', port });

      expect(body).toBe(`${POLISH_TEXT} ${PERSIAN_TEXT}`);
    });

    it('resolves with an empty string when the body is empty', async () => {
      expect(await request({ hostname: '127.0.0.1', path: '/empty', port })).toBe('');
    });

    it('resolves with the body of an error status, because parsers read not-found pages', async () => {
      expect(await request({ hostname: '127.0.0.1', path: '/not-found', port })).toBe('{"status":404}');
    });

    it('follows redirects', async () => {
      expect(await request({ hostname: '127.0.0.1', path: '/moved', port })).toBe('hello');
    });

    it('sends the given headers', async () => {
      const headers: IncomingHttpHeaders = { 'x-word': 'kot' };

      expect(await request({ headers, hostname: '127.0.0.1', path: '/headers', port })).toBe('kot');
    });

    it('rejects when the connection is refused', async () => {
      const closedServer = serve({ fetch: () => new Response(), hostname: '127.0.0.1', port: 0 });
      const closedPort = Number(closedServer.port);
      await closedServer.stop(true);

      const rejection = await request({ hostname: '127.0.0.1', path: '/', port: closedPort }).catch(returnError);

      expect(rejection).toMatchObject({ code: 'ECONNREFUSED' });
    });
  });

  describe('over https', () => {
    it('uses the https agent', async () => {
      respondWith('secure');

      expect(await request({ hostname: 'example.invalid', protocol: 'https' })).toBe('secure');
      expect(httpsGet).toHaveBeenCalledTimes(1);
      expect(httpGet).not.toHaveBeenCalled();
    });

    it('passes every option except the protocol to the agent', async () => {
      respondWith('secure');
      const headers = { 'User-Agent': 'test' };

      await request({ headers, hostname: 'example.invalid', path: '/word', protocol: 'https' });

      expect(httpsGet.mock.calls[0][0]).toStrictEqual({ headers, hostname: 'example.invalid', path: '/word' });
    });

    it('joins a body that arrives in many chunks', async () => {
      respondWith('first ', 'second ', 'third');

      expect(await request({ protocol: 'https' })).toBe('first second third');
    });

    it('decodes a two-byte character that is split between chunks', async () => {
      const bytes = Buffer.from('ł');
      respondWith(Buffer.from('ż'), bytes.subarray(0, 1), bytes.subarray(1), Buffer.from('w'));

      expect(await request({ protocol: 'https' })).toBe('żłw');
    });

    it('decodes a Persian text that is split into single bytes', async () => {
      const bytes = Buffer.from(PERSIAN_TEXT);
      respondWith(...Array.from(bytes, (byte) => Buffer.from([byte])));

      expect(await request({ protocol: 'https' })).toBe(PERSIAN_TEXT);
    });

    it('rejects with the error of the request', async () => {
      const error = new Error('getaddrinfo ENOTFOUND example.invalid');
      const clientRequest = new EventEmitter();
      httpsGet.mockImplementation(() => clientRequest);

      const response = request({ protocol: 'https' }).catch(returnError);
      clientRequest.emit('error', error);

      expect(await response).toBe(error);
    });
  });

  it.todo('rejects when the connection drops in the middle of the response body');
});

function streamOf(...chunks: string[]): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      chunks.forEach((chunk) => {
        controller.enqueue(encoder.encode(chunk));
      });
      controller.close();
    },
  });
}

function respondWith(...chunks: (Buffer | string)[]): void {
  httpsGet.mockImplementation((_, onResponse) => {
    const response = new PassThrough();
    onResponse(response);
    chunks.forEach((chunk) => {
      response.write(chunk);
    });
    response.end();
    return new EventEmitter();
  });
}

function returnError(error: unknown): unknown {
  return error;
}
