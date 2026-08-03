import { Gaddag } from '@kamilmielnik/gaddag';
import { Locale } from '@scrabble-solver/types';
import { describe, expect, it, mock } from 'bun:test';

import type * as getGaddagModule from './getGaddag';

let dictionary: Uint8Array | undefined;

await mock.module('./dictionaries', () => ({
  getDictionary: () => Promise.resolve(dictionary),
}));

const { getGaddag }: typeof getGaddagModule = await import('./getGaddag');

describe('getGaddag', () => {
  it('returns undefined when there is no cached dictionary', async () => {
    dictionary = undefined;
    expect(await getGaddag(Locale.EN_US)).toBeUndefined();
  });

  it('deserializes a cached dictionary', async () => {
    dictionary = Gaddag.fromArray(['scrabble', 'solver']).serialize();
    const gaddag = await getGaddag(Locale.EN_US);

    expect(gaddag?.has('scrabble')).toBe(true);
    expect(gaddag?.has('trie')).toBe(false);
  });

  it('returns undefined for a dictionary cached by an app version with an incompatible format', async () => {
    dictionary = new TextEncoder().encode('serialized trie from a previous app version');
    expect(await getGaddag(Locale.EN_US)).toBeUndefined();
  });

  it('returns undefined for a corrupted dictionary', async () => {
    dictionary = Gaddag.fromArray(['scrabble']).serialize().subarray(0, 10);
    expect(await getGaddag(Locale.EN_US)).toBeUndefined();
  });
});
