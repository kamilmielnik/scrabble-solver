import { Locale } from '@scrabble-solver/types';
import { describe, expect, it } from 'bun:test';

import { installFetcherHarness } from '../test/installFetcherHarness';

import type * as germanModule from './german';

const harness = installFetcherHarness();
const { getWordList }: typeof germanModule = await import('./german');

const FILE_URL =
  'https://raw.githubusercontent.com/kamilmielnik/scrabble-dictionaries/refs/heads/master/german/german.txt';

describe('german getWordList', () => {
  it('returns the lower-cased words of the German list', async () => {
    harness.serve(FILE_URL, 'AAL\nABEND\n');

    expect(await getWordList()).toEqual(['aal', 'abend']);
    expect(harness.requestedUrls).toEqual([FILE_URL]);
  });

  it('collates the file using the German locale', async () => {
    harness.serve(FILE_URL, 'AAL\n');

    await getWordList();

    expect(harness.getCollationLocales()).toEqual([Locale.DE_DE]);
  });

  it('keeps umlauts, because they are separate German tiles', async () => {
    harness.serve(FILE_URL, 'aal\nÄPFEL\nöl\nübung\n');

    expect(await getWordList()).toEqual(['aal', 'äpfel', 'öl', 'übung']);
  });
});
