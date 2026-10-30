import { Locale } from '@scrabble-solver/types';
import { describe, expect, it } from 'bun:test';

import { installFetcherHarness } from '../test/installFetcherHarness';

import type * as englishModule from './english';

const harness = installFetcherHarness();
const { getWordListGb, getWordListUs }: typeof englishModule = await import('./english');

const SOWPODS_URL =
  'https://raw.githubusercontent.com/kamilmielnik/scrabble-dictionaries/refs/heads/master/english/sowpods.txt';
const TWL06_URL =
  'https://raw.githubusercontent.com/kamilmielnik/scrabble-dictionaries/refs/heads/master/english/twl06.txt';

describe('getWordListGb', () => {
  it('returns the lower-cased words of SOWPODS', async () => {
    harness.serve(SOWPODS_URL, 'AA\r\nAAH\r\nZYZZYVA\r\n');

    expect(await getWordListGb()).toEqual(['aa', 'aah', 'zyzzyva']);
    expect(harness.requestedUrls).toEqual([SOWPODS_URL]);
  });

  it('lower-cases the file using the British locale', async () => {
    harness.serve(SOWPODS_URL, 'AA\n');

    await getWordListGb();

    expect(harness.getLowerCasingLocales()).toEqual([Locale.EN_GB]);
  });
});

describe('getWordListUs', () => {
  it('returns the lower-cased words of TWL06', async () => {
    harness.serve(TWL06_URL, 'AA\r\nAAH\r\nZZZ\r\n');

    expect(await getWordListUs()).toEqual(['aa', 'aah', 'zzz']);
    expect(harness.requestedUrls).toEqual([TWL06_URL]);
  });

  it('lower-cases the file using the American locale', async () => {
    harness.serve(TWL06_URL, 'AA\n');

    await getWordListUs();

    expect(harness.getLowerCasingLocales()).toEqual([Locale.EN_US]);
  });
});
