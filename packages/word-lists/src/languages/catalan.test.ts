import { Locale } from '@scrabble-solver/types';
import { describe, expect, it } from 'bun:test';

import { installFetcherHarness } from '../test/installFetcherHarness';

import type * as catalanModule from './catalan';

const harness = installFetcherHarness();
const { getWordList }: typeof catalanModule = await import('./catalan');

const FILE_URL = 'https://raw.githubusercontent.com/kamilmielnik/scrabble-dictionaries/master/catalan/disc.txt';

describe('catalan getWordList', () => {
  it('returns the lower-cased words of DISC', async () => {
    harness.serve(FILE_URL, 'ABAC\nABACA\n');

    expect(await getWordList()).toEqual(['abac', 'abaca']);
    expect(harness.requestedUrls).toEqual([FILE_URL]);
  });

  it('lower-cases the file using the Catalan locale', async () => {
    harness.serve(FILE_URL, 'ABAC\n');

    await getWordList();

    expect(harness.getLowerCasingLocales()).toEqual([Locale.CA_ES]);
  });

  it('strips accents, because Catalan tiles have none', async () => {
    harness.serve(FILE_URL, 'àbac\ncafè\nqüestió\npaís\n');

    expect(await getWordList()).toEqual(['abac', 'cafe', 'questio', 'pais']);
  });

  it('keeps ç, which has its own tile', async () => {
    harness.serve(FILE_URL, 'força\ncançó\n');

    expect(await getWordList()).toEqual(['força', 'canço']);
  });

  it('keeps the middle dot, which is a part of the l·l tile', async () => {
    harness.serve(FILE_URL, 'cel·la\ncella\n');

    expect(await getWordList()).toEqual(['cel·la', 'cella']);
  });

  it('merges words that differ only by accents', async () => {
    harness.serve(FILE_URL, 'catorze\ncatorzè\n');

    expect(await getWordList()).toEqual(['catorze']);
  });
});
