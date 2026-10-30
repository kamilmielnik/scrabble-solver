/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Gaddag } from '@kamilmielnik/gaddag';
import { Locale } from '@scrabble-solver/types';
import { beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';
import { gunzipSync } from 'node:zlib';

import type * as dictionaryLocaleModule from '../../pages/api/dictionary/[locale]/index';
import type * as testApiModule from '../../test/api';

const logEvent = mock<(event: Record<string, unknown>) => void>();
const logError = mock<(operation: string, error: unknown, context: Record<string, unknown>) => void>();
const get = mock((_locale: Locale): Promise<Gaddag> => Promise.resolve(Gaddag.fromArray(['cat'])));

await mock.module('@scrabble-solver/logger', () => ({ logError, logEvent }));
await mock.module('@scrabble-solver/dictionaries', () => ({ dictionaries: { get } }));

const { config, default: handler }: typeof dictionaryLocaleModule =
  await import('../../pages/api/dictionary/[locale]/index');
const { createApiRequest, createApiResponse }: typeof testApiModule = await import('../../test/api');

beforeEach(() => {
  logEvent.mockClear();
  logError.mockClear();
  get.mockClear();
  get.mockImplementation(() => Promise.resolve(Gaddag.fromArray(['cat'])));
});

describe('/api/dictionary/[locale]', () => {
  it('rejects an unknown locale with 400', async () => {
    const response = await download({ locale: 'xx-XX' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: 'Bad request', message: 'Invalid "locale" parameter' });
  });

  it('serves the dictionary as a binary payload clients revalidate', async () => {
    const response = await download();

    expect(response.statusCode).toBe(200);
    expect(response.headers).toMatchObject({
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/octet-stream',
      Vary: 'Accept-Encoding',
    });
    expect(Gaddag.deserialize(new Uint8Array(response.body as Buffer)).has('cat')).toBe(true);
  });

  it('allows a 50 MB response', () => {
    expect(config.api.responseLimit).toBe('50mb');
  });

  it('logs the download', async () => {
    const response = await download();

    expect(logEvent.mock.calls[0][0]).toMatchObject({
      bytes: (response.body as Buffer).byteLength,
      encoding: 'identity',
      ip: '10.0.0.1',
      locale: Locale.EN_US,
      status: 200,
      type: 'download',
    });
  });

  it('logs no bytes when Next answers the conditional request with 304', async () => {
    const response = createApiResponse();
    const send = response.send;

    response.send = (body) => {
      send(body);
      response.statusCode = 304;
    };

    await handler(createApiRequest({ method: 'GET', query: { locale: Locale.EN_US } }), response);

    expect(logEvent.mock.calls[0][0]).toMatchObject({ bytes: 0, status: 304 });
  });

  describe('content negotiation', () => {
    it.each([
      ['gzip'],
      ['gzip, deflate, br'],
      ['GZIP'],
      ['x-gzip'],
      ['gzip;q=1.0'],
      ['gzip ; q=0.5'],
      ['*'],
      ['deflate, *;q=0.1'],
      ['*;q=0, gzip'],
    ])('compresses for Accept-Encoding: %s', async (acceptEncoding) => {
      const response = await download({ acceptEncoding });

      expect(response.headers['Content-Encoding']).toBe('gzip');
      expect(Gaddag.deserialize(new Uint8Array(gunzipSync(response.body as Buffer))).has('cat')).toBe(true);
      expect(logEvent.mock.calls[0][0]).toMatchObject({ encoding: 'gzip' });
    });

    it.each([
      [''],
      ['deflate, br'],
      ['identity'],
      ['gzip;q=0'],
      ['gzip;q=0.0'],
      ['gzip; Q=0'],
      ['*;q=0'],
      ['*;q=0.000'],
      ['*, gzip;q=0'],
      ['gzip;q=0, *'],
    ])('serves identity for Accept-Encoding: %s', async (acceptEncoding) => {
      const response = await download({ acceptEncoding });

      expect(response.headers['Content-Encoding']).toBeUndefined();
      expect(Gaddag.deserialize(new Uint8Array(response.body as Buffer)).has('cat')).toBe(true);
      expect(response.headers.Vary).toBe('Accept-Encoding');
    });

    it('serves identity without the header', async () => {
      const response = await download();

      expect(response.headers['Content-Encoding']).toBeUndefined();
    });

    it('reads a repeated header', async () => {
      const response = await download({ acceptEncoding: ['deflate', 'gzip'] });

      expect(response.headers['Content-Encoding']).toBe('gzip');
    });
  });

  describe('caching per in-memory dictionary', () => {
    it('serializes once for identity', async () => {
      const gaddag = Gaddag.fromArray(['cat']);
      const serialize = spyOn(gaddag, 'serialize');
      get.mockImplementation(() => Promise.resolve(gaddag));

      const [first, second] = [await download(), await download()];

      expect(first.body).toBe(second.body);
      expect(serialize).toHaveBeenCalledTimes(1);
    });

    it('compresses once even for concurrent requests', async () => {
      const gaddag = Gaddag.fromArray(['cat']);
      const serialize = spyOn(gaddag, 'serialize');
      get.mockImplementation(() => Promise.resolve(gaddag));

      const [first, second] = await Promise.all([
        download({ acceptEncoding: 'gzip' }),
        download({ acceptEncoding: 'gzip' }),
      ]);

      expect(first.body).toBe(second.body);
      expect(serialize).toHaveBeenCalledTimes(1);
    });

    it('produces a new variant for a rebuilt dictionary', async () => {
      await download({ acceptEncoding: 'gzip' });
      get.mockImplementation(() => Promise.resolve(Gaddag.fromArray(['dog'])));

      const response = await download({ acceptEncoding: 'gzip' });

      expect(Gaddag.deserialize(new Uint8Array(gunzipSync(response.body as Buffer))).has('dog')).toBe(true);
    });

    it('evicts a failed compression so the next request retries', async () => {
      const gaddag = Gaddag.fromArray(['cat']);
      spyOn(gaddag, 'serialize').mockImplementationOnce(() => 1 as never);
      get.mockImplementation(() => Promise.resolve(gaddag));

      const failed = await download({ acceptEncoding: 'gzip' });
      const retried = await download({ acceptEncoding: 'gzip' });

      expect(failed.statusCode).toBe(500);
      expect(logError).toHaveBeenCalledTimes(1);
      expect(retried.statusCode).toBe(200);
      expect(Gaddag.deserialize(new Uint8Array(gunzipSync(retried.body as Buffer))).has('cat')).toBe(true);
    });
  });
});

interface DownloadOptions {
  acceptEncoding?: string[] | string;
  locale?: string;
}

async function download({ acceptEncoding, locale = Locale.EN_US }: DownloadOptions = {}) {
  const response = createApiResponse();
  const headers = typeof acceptEncoding === 'undefined' ? {} : { 'accept-encoding': acceptEncoding };

  await handler(createApiRequest({ headers: headers as never, method: 'GET', query: { locale } }), response);

  return response;
}
