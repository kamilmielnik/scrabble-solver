import { Locale } from '@scrabble-solver/types';
import { describe, expect, it } from 'bun:test';

import { installFetcherHarness } from '../test/installFetcherHarness';

import type * as spanishModule from './spanish';

const harness = installFetcherHarness();
const { getWordList }: typeof spanishModule = await import('./spanish');

const FILE_URL = 'https://raw.githubusercontent.com/kamilmielnik/scrabble-dictionaries/master/spanish/file-2017.txt';

describe('spanish getWordList', () => {
  it('returns the lower-cased words of FILE 2017', async () => {
    harness.serve(FILE_URL, 'AA\nABACO\n');

    expect(await getWordList()).toEqual(['aa', 'abaco']);
    expect(harness.requestedUrls).toEqual([FILE_URL]);
  });

  it('collates the file using the Spanish locale', async () => {
    harness.serve(FILE_URL, 'AA\n');

    await getWordList();

    expect(harness.getCollationLocales()).toEqual([Locale.ES_ES]);
  });

  it('keeps ñ, because it is a separate Spanish tile', async () => {
    harness.serve(FILE_URL, 'aa\nAÑO\nñu\n');

    expect(await getWordList()).toEqual(['aa', 'año', 'ñu']);
  });

  it('strips every other diacritic', async () => {
    harness.serve(FILE_URL, 'aa\ncanción\npingüino\nÑANDÚ\n');

    expect(await getWordList()).toEqual(['aa', 'cancion', 'pinguino', 'ñandu']);
  });

  it('keeps ano and año apart while merging words that differ by an accent', async () => {
    harness.serve(FILE_URL, 'aa\nano\naño\nsi\nsí\n');

    expect(await getWordList()).toEqual(['aa', 'ano', 'año', 'si']);
  });
});
