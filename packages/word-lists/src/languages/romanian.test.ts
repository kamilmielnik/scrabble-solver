import { Locale } from '@scrabble-solver/types';
import { describe, expect, it } from 'bun:test';

import { installFetcherHarness } from '../test/installFetcherHarness';

import type * as romanianModule from './romanian';

const harness = installFetcherHarness();
const { getWordList }: typeof romanianModule = await import('./romanian');

const FILE_URL = 'https://raw.githubusercontent.com/kamilmielnik/scrabble-dictionaries/master/romanian/loc-5.0.txt';

describe('romanian getWordList', () => {
  it('returns the lower-cased words of LOC 5.0', async () => {
    harness.serve(FILE_URL, 'AA\nABAC\n');

    expect(await getWordList()).toEqual(['aa', 'abac']);
    expect(harness.requestedUrls).toEqual([FILE_URL]);
  });

  it('collates the file using the Romanian locale', async () => {
    harness.serve(FILE_URL, 'AA\n');

    await getWordList();

    expect(harness.getCollationLocales()).toEqual([Locale.RO_RO]);
  });

  it('strips diacritics, because Romanian tiles have none', async () => {
    harness.serve(FILE_URL, 'aa\nȘARPE\nțară\nînger\nmână\n');

    expect(await getWordList()).toEqual(['aa', 'sarpe', 'tara', 'inger', 'mana']);
  });

  it('merges words that differ only by diacritics', async () => {
    harness.serve(FILE_URL, 'aa\nmana\nmână\n');

    expect(await getWordList()).toEqual(['aa', 'mana']);
  });
});
