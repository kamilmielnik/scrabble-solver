import { Gaddag } from '@kamilmielnik/gaddag';
import { Locale } from '@scrabble-solver/types';
import { describe, expect, it, mock } from 'bun:test';

import type * as getGaddagModule from './getGaddag';

let dictionary: Response | undefined;
const generations: Partial<Record<Locale, number>> = {};
const deletedLocales: Locale[] = [];

await mock.module('./dictionaries', () => ({
  deleteDictionary: (locale: Locale) => {
    deletedLocales.push(locale);
    return Promise.resolve();
  },
  getDictionary: () => Promise.resolve(dictionary),
  getDictionaryGeneration: (locale: Locale) => generations[locale] ?? 0,
}));

const { getGaddag }: typeof getGaddagModule = await import('./getGaddag');

describe('getGaddag', () => {
  it('returns undefined when there is no cached dictionary', async () => {
    dictionary = undefined;
    expect(await getGaddag(Locale.EN_US)).toBeUndefined();
  });

  it('deserializes a cached dictionary', async () => {
    dictionary = new Response(Gaddag.fromArray(['scrabble', 'solver']).serialize());
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

  it('reuses the deserialized dictionary until the generation changes', async () => {
    dictionary = new Response(Gaddag.fromArray(['scrabble']).serialize());
    const first = await getGaddag(Locale.EN_GB);
    dictionary = new Response(Gaddag.fromArray(['solver']).serialize());
    const second = await getGaddag(Locale.EN_GB);
    generations[Locale.EN_GB] = 1;
    const third = await getGaddag(Locale.EN_GB);

    expect(first?.has('scrabble')).toBe(true);
    expect(second).toBe(first);
    expect(third?.has('solver')).toBe(true);
    expect(third).not.toBe(first);
  });
});
