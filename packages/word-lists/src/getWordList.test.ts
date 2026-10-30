import { Locale } from '@scrabble-solver/types';
import { describe, expect, it } from 'bun:test';

import type * as getWordListModule from './getWordList';
import { getRejection } from './test/getRejection';
import { installFetcherHarness } from './test/installFetcherHarness';

const harness = installFetcherHarness();
const { getWordList }: typeof getWordListModule = await import('./getWordList');

const REPOSITORY = 'https://raw.githubusercontent.com/kamilmielnik/scrabble-dictionaries';
const POLISH_PAGE_URL = 'https://sjp.pl/sl/growy/';

const LOCALE_FILE_URLS: Record<Locale, string> = {
  [Locale.DE_DE]: `${REPOSITORY}/refs/heads/master/german/german.txt`,
  [Locale.EN_GB]: `${REPOSITORY}/refs/heads/master/english/sowpods.txt`,
  [Locale.EN_US]: `${REPOSITORY}/refs/heads/master/english/twl06.txt`,
  [Locale.ES_ES]: `${REPOSITORY}/master/spanish/file-2017.txt`,
  [Locale.FA_IR]: `${REPOSITORY}/refs/heads/master/persian/persian.txt`,
  [Locale.FR_FR]: `${REPOSITORY}/refs/heads/master/french/ods8.txt`,
  [Locale.PL_PL]: `${REPOSITORY}/refs/heads/master/polish/sjp.txt`,
  [Locale.RO_RO]: `${REPOSITORY}/master/romanian/loc-5.0.txt`,
  [Locale.TR_TR]: `${REPOSITORY}/master/turkish/kelimelik.txt`,
};

describe('getWordList', () => {
  it('knows the word list of every locale', () => {
    expect(Object.keys(LOCALE_FILE_URLS).sort()).toEqual(Object.values(Locale).sort());
  });

  it.each(Object.values(Locale).filter((locale) => locale !== Locale.PL_PL))(
    'dispatches %s to its word list',
    async (locale) => {
      harness.serve(LOCALE_FILE_URLS[locale], 'aa\nab\n');

      expect(await getWordList(locale)).toEqual(['aa', 'ab']);
      expect(harness.requestedUrls).toEqual([LOCALE_FILE_URLS[locale]]);
      expect(harness.getCollationLocales()).toEqual([locale]);
    },
  );

  it('dispatches pl-PL to the Polish fetcher, which starts at the sjp.pl page', async () => {
    harness.serve(POLISH_PAGE_URL, '<a href="nothing-to-see-here.html">nothing</a>');
    harness.serve(LOCALE_FILE_URLS[Locale.PL_PL], 'aa\nab\n');

    expect(await getWordList(Locale.PL_PL)).toEqual(['aa', 'ab']);
    expect(harness.requestedUrls).toEqual([POLISH_PAGE_URL, LOCALE_FILE_URLS[Locale.PL_PL]]);
    expect(harness.getCollationLocales()).toEqual([Locale.PL_PL]);
  });

  it('fails for an unknown locale', async () => {
    expect(await getRejection((async () => getWordList('xx-XX' as Locale))())).toBeInstanceOf(TypeError);
    expect(harness.requestedUrls).toEqual([]);
  });
});
