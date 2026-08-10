import { Gaddag } from '@kamilmielnik/gaddag';
import { Locale } from '@scrabble-solver/types';
import { describe, expect, it, mock } from 'bun:test';

import type * as getGaddagModule from './getGaddag';

let dictionary: Response | undefined;
const deletedLocales: Locale[] = [];

await mock.module('./dictionaries', () => ({
  deleteDictionary: (locale: Locale) => {
    deletedLocales.push(locale);
    return Promise.resolve();
  },
  getDictionary: () => Promise.resolve(dictionary),
}));

const { getGaddag }: typeof getGaddagModule = await import('./getGaddag');

describe('getGaddag', () => {
  it('returns undefined when there is no cached dictionary', async () => {
    dictionary = undefined;
    expect(await getGaddag(Locale.EN_US)).toBeUndefined();
  });

  it('deserializes a cached dictionary', async () => {
    dictionary = createDictionary(['scrabble', 'solver']);
    const gaddag = await getGaddag(Locale.EN_US);

    expect(gaddag?.has('scrabble')).toBe(true);
    expect(gaddag?.has('trie')).toBe(false);
  });

  it('deletes a dictionary cached by an app version with an incompatible format', async () => {
    dictionary = new Response('serialized trie from a previous app version');

    expect(await getGaddag(Locale.PL_PL)).toBeUndefined();
    expect(deletedLocales).toContain(Locale.PL_PL);
  });

  it('deletes a corrupted dictionary', async () => {
    dictionary = new Response(Gaddag.fromArray(['scrabble']).serialize().subarray(0, 10));

    expect(await getGaddag(Locale.FA_IR)).toBeUndefined();
    expect(deletedLocales).toContain(Locale.FA_IR);
  });

  it('reuses the deserialized dictionary while the cached response is unchanged', async () => {
    dictionary = createDictionary(['scrabble'], { etag: '"v1"' });
    const first = await getGaddag(Locale.EN_GB);
    dictionary = createDictionary(['scrabble'], { etag: '"v1"' });
    const second = await getGaddag(Locale.EN_GB);

    expect(first?.has('scrabble')).toBe(true);
    expect(second).toBe(first);
  });

  it('reuses the deserialized dictionary when a revalidation only refreshes the Date header', async () => {
    dictionary = createDictionary(['scrabble'], { date: 'Thu, 06 Aug 2026 00:00:00 GMT', etag: '"v1"' });
    const first = await getGaddag(Locale.FR_FR);
    dictionary = createDictionary(['scrabble'], { date: 'Fri, 07 Aug 2026 00:00:00 GMT', etag: '"v1"' });
    const second = await getGaddag(Locale.FR_FR);

    expect(first?.has('scrabble')).toBe(true);
    expect(second).toBe(first);
  });

  it('picks up a dictionary another tab wrote into the shared cache', async () => {
    dictionary = createDictionary(['scrabble'], { etag: '"v1"' });
    const first = await getGaddag(Locale.TR_TR);
    dictionary = createDictionary(['solver'], { etag: '"v2"' });
    const second = await getGaddag(Locale.TR_TR);

    expect(first?.has('scrabble')).toBe(true);
    expect(second).not.toBe(first);
    expect(second?.has('solver')).toBe(true);
  });

  it('falls back to the Date header for responses without an ETag', async () => {
    dictionary = createDictionary(['scrabble'], { date: 'Thu, 06 Aug 2026 00:00:00 GMT' });
    const first = await getGaddag(Locale.DE_DE);
    dictionary = createDictionary(['scrabble'], { date: 'Thu, 06 Aug 2026 00:00:00 GMT' });
    const second = await getGaddag(Locale.DE_DE);
    dictionary = createDictionary(['scrabble'], { date: 'Fri, 07 Aug 2026 00:00:00 GMT' });
    const third = await getGaddag(Locale.DE_DE);

    expect(first?.has('scrabble')).toBe(true);
    expect(second).toBe(first);
    expect(third).not.toBe(first);
    expect(third?.has('scrabble')).toBe(true);
  });

  it('memoizes each locale independently', async () => {
    dictionary = createDictionary(['scrabble'], { etag: '"es"' });
    const spanish = await getGaddag(Locale.ES_ES);
    dictionary = createDictionary(['solver'], { etag: '"ro"' });
    const romanian = await getGaddag(Locale.RO_RO);
    dictionary = createDictionary(['scrabble'], { etag: '"es"' });
    const spanishAgain = await getGaddag(Locale.ES_ES);

    expect(spanish?.has('scrabble')).toBe(true);
    expect(romanian?.has('solver')).toBe(true);
    expect(spanishAgain).toBe(spanish);
  });
});

function createDictionary(words: string[], headers: Record<string, string> = {}): Response {
  return new Response(Gaddag.fromArray(words).serialize(), { headers });
}
