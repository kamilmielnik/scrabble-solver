import { Locale } from '@scrabble-solver/types';
import { describe, expect, it } from 'bun:test';

import { installFetcherHarness } from '../test/installFetcherHarness';

import type * as turkishModule from './turkish';

const harness = installFetcherHarness();
const { getWordList }: typeof turkishModule = await import('./turkish');

const FILE_URL = 'https://raw.githubusercontent.com/kamilmielnik/scrabble-dictionaries/master/turkish/kelimelik.txt';

describe('turkish getWordList', () => {
  it('returns the words of the Kelimelik list', async () => {
    harness.serve(FILE_URL, 'aa\nabla\n');

    expect(await getWordList()).toEqual(['aa', 'abla']);
    expect(harness.requestedUrls).toEqual([FILE_URL]);
  });

  it('collates the file using the Turkish locale', async () => {
    harness.serve(FILE_URL, 'aa\n');

    await getWordList();

    expect(harness.getCollationLocales()).toEqual([Locale.TR_TR]);
  });

  it('keeps Turkish letters, because they are separate tiles', async () => {
    harness.serve(FILE_URL, 'aa\nçiğ\nkız\nşöför\n');

    expect(await getWordList()).toEqual(['aa', 'çiğ', 'kız', 'şöför']);
  });

  it.todo('lower-cases upper-case I to dotless ı', async () => {
    harness.serve(FILE_URL, 'aa\nKIZ\n');

    expect(await getWordList()).toEqual(['aa', 'kız']);
  });
});
