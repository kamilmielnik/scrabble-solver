import { Locale } from '@scrabble-solver/types';
import { describe, expect, it } from 'bun:test';

import { getRejection } from '../test/getRejection';
import { installFetcherHarness } from '../test/installFetcherHarness';

import type * as persianModule from './persian';

const harness = installFetcherHarness();
const { getWordList }: typeof persianModule = await import('./persian');

const FILE_URL =
  'https://raw.githubusercontent.com/kamilmielnik/scrabble-dictionaries/refs/heads/master/persian/persian.txt';

describe('persian getWordList', () => {
  it('returns the words of the Persian list in their original script', async () => {
    harness.serve(FILE_URL, 'اا\nپدر\nژاله\n');

    expect(await getWordList()).toEqual(['اا', 'پدر', 'ژاله']);
    expect(harness.requestedUrls).toEqual([FILE_URL]);
  });

  it('lower-cases the file using the Persian locale', async () => {
    harness.serve(FILE_URL, 'اا\n');

    await getWordList();

    expect(harness.getLowerCasingLocales()).toEqual([Locale.FA_IR]);
  });

  it('propagates a failed download', async () => {
    harness.serve(FILE_URL, 'gone', 404);

    expect((await getRejection(getWordList())).message).toContain(`Cannot download file: ${FILE_URL}`);
  });
});
