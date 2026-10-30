import { Locale } from '@scrabble-solver/types';
import { describe, expect, it } from 'bun:test';

import { installFetcherHarness } from '../test/installFetcherHarness';

import type * as frenchModule from './french';

const harness = installFetcherHarness();
const { getWordList }: typeof frenchModule = await import('./french');

const ODS8_URL =
  'https://raw.githubusercontent.com/kamilmielnik/scrabble-dictionaries/refs/heads/master/french/ods8.txt';

describe('french getWordList', () => {
  it('returns the lower-cased words of ODS8', async () => {
    harness.serve(ODS8_URL, 'AA\nABACA\n');

    expect(await getWordList()).toEqual(['aa', 'abaca']);
    expect(harness.requestedUrls).toEqual([ODS8_URL]);
  });

  it('collates the file using the French locale', async () => {
    harness.serve(ODS8_URL, 'AA\n');

    await getWordList();

    expect(harness.getCollationLocales()).toEqual([Locale.FR_FR]);
  });

  it('strips diacritics, because French tiles have none', async () => {
    harness.serve(ODS8_URL, 'aa\nÉTÉ\ngarçon\ncœur\n');

    expect(await getWordList()).toEqual(['aa', 'ete', 'garcon', 'coeur']);
  });

  it('merges words that differ only by diacritics', async () => {
    harness.serve(ODS8_URL, 'aa\nmur\nmûr\n');

    expect(await getWordList()).toEqual(['aa', 'mur']);
  });
});
