import { type APIRequestContext, expect, test } from '@playwright/test';

const DICTIONARY_URL = '/api/dictionary/en-US';
const MAXIMUM_WORDS_COUNT = 8;

interface CellJson {
  isEmpty: boolean;
  tile: { character: string; isBlank: boolean } | null;
  x: number;
  y: number;
}

/**
 * Handlers are unit tested with fake requests. These cover what only the real server adds:
 * transport encoding, ETags, body parsing and payload limits.
 */
test.describe('API over HTTP', () => {
  test.describe('dictionary download', () => {
    test('compresses for clients that accept gzip, and tells caches that it varies', async ({ request }) => {
      const response = await getDictionary(request, 'gzip');

      expect(response.status()).toBe(200);
      expect(response.headers()).toMatchObject({
        'cache-control': 'no-cache',
        'content-encoding': 'gzip',
        'content-type': 'application/octet-stream',
        vary: 'Accept-Encoding',
      });
    });

    for (const [header, isCompressed] of [
      ['identity', false],
      ['gzip;q=0', false],
      ['*', true],
      ['*;q=0', false],
      ['br, GZIP;q=0.5', true],
    ] as const) {
      test(`${isCompressed ? 'compresses' : 'does not compress'} for "Accept-Encoding: ${header}"`, async ({
        request,
      }) => {
        const response = await getDictionary(request, header);

        expect(response.status()).toBe(200);
        expect(response.headers()['content-encoding']).toBe(isCompressed ? 'gzip' : undefined);
      });
    }

    test('sends the same dictionary, whichever the encoding', async ({ request }) => {
      const compressed = await getDictionary(request, 'gzip');
      const plain = await getDictionary(request, 'identity');

      expect((await compressed.body()).equals(await plain.body())).toBe(true);
      expect(Number(compressed.headers()['content-length'])).toBeLessThan(Number(plain.headers()['content-length']));
    });

    test('answers 304 to a client holding the current dictionary', async ({ request }) => {
      const response = await getDictionary(request, 'gzip');
      const revalidation = await request.get(DICTIONARY_URL, {
        headers: { 'Accept-Encoding': 'gzip', 'If-None-Match': response.headers().etag },
      });

      expect(revalidation.status()).toBe(304);
      expect(await revalidation.body()).toHaveLength(0);
    });

    test('sends the whole dictionary to a client holding an outdated one', async ({ request }) => {
      const response = await request.get(DICTIONARY_URL, {
        headers: { 'Accept-Encoding': 'gzip', 'If-None-Match': '"outdated"' },
      });

      expect(response.status()).toBe(200);
    });

    test('rejects an unknown locale with JSON', async ({ request }) => {
      const response = await request.get('/api/dictionary/xx-XX');

      expect(response.status()).toBe(400);
      expect(await response.json()).toEqual({ error: 'Bad request', message: 'Invalid "locale" parameter' });
    });
  });

  test.describe('request bodies', () => {
    test('rejects a body that is not valid JSON', async ({ request }) => {
      const response = await request.post('/api/solve', {
        data: '{ corrupt',
        headers: { 'Content-Type': 'application/json' },
      });

      expect(response.status()).toBe(400);
    });

    test('solves the largest board of any game', async ({ request }) => {
      const response = await request.post('/api/solve', {
        data: { board: createBoard(27, 19), characters: ['a', 't'], game: 'letter-league', locale: 'en-US' },
      });

      expect(response.status()).toBe(200);
      expect(await response.json()).not.toEqual([]);
    });

    test('verifies a full board of the largest game', async ({ request }) => {
      const response = await request.post('/api/verify', {
        data: { board: createBoard(27, 19, 'a'), game: 'letter-league', locale: 'en-US' },
      });

      expect(response.status()).toBe(200);
      expect(await response.json()).toMatchObject({ validWords: [] });
    });

    test('accepts a visit without a body', async ({ request }) => {
      const response = await request.put('/api/visit');

      expect(response.status()).toBe(200);
      expect(await response.json()).toBe(true);
    });
  });

  test.describe('word definitions', () => {
    test('rejects too many words before asking any dictionary website', async ({ request }) => {
      const words = Array.from({ length: MAXIMUM_WORDS_COUNT + 1 }, (_word, index) => `word${index}`);
      const response = await request.get(`/api/dictionary/en-US/${words.join(',')}`);

      expect(response.status()).toBe(400);
    });

    test('rejects an unknown locale', async ({ request }) => {
      expect((await request.get('/api/dictionary/xx-XX/word')).status()).toBe(400);
    });
  });
});

function getDictionary(request: APIRequestContext, acceptEncoding: string) {
  return request.get(DICTIONARY_URL, { headers: { 'Accept-Encoding': acceptEncoding } });
}

function createBoard(width: number, height: number, character?: string): CellJson[][] {
  return Array.from({ length: height }, (_row, y) => {
    return Array.from({ length: width }, (_cell, x) => ({
      isEmpty: typeof character === 'undefined',
      tile: character ? { character, isBlank: false } : null,
      x,
      y,
    }));
  });
}
