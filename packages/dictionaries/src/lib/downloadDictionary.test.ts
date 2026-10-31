import { Locale } from '@scrabble-solver/types';
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';

import { getRejection } from '../test/getRejection';

import type * as downloadDictionaryModule from './downloadDictionary';

const getWordList = mock<(locale: Locale) => Promise<string[]>>();
const logEvent = mock();

await mock.module('@scrabble-solver/logger', () => ({ logError: mock(), logEvent }));
await mock.module('@scrabble-solver/word-lists', () => ({ getWordList }));

const { downloadDictionary }: typeof downloadDictionaryModule = await import('./downloadDictionary');

describe('downloadDictionary', () => {
  beforeEach(() => {
    getWordList.mockReset();
    logEvent.mockReset();
  });

  afterEach(() => {
    mock.restore();
  });

  it('builds a dictionary out of the word list of the given locale', async () => {
    getWordList.mockResolvedValue(['scrabble', 'solver']);

    const gaddag = await downloadDictionary(Locale.EN_GB);

    expect(getWordList).toHaveBeenCalledTimes(1);
    expect(getWordList).toHaveBeenCalledWith(Locale.EN_GB);
    expect(gaddag.has('scrabble')).toBe(true);
    expect(gaddag.has('solver')).toBe(true);
    expect(gaddag.has('trie')).toBe(false);
  });

  it.each([
    [Locale.FA_IR, ['سلام', 'کتاب']],
    [Locale.PL_PL, ['zażółć', 'gęślą']],
    [Locale.TR_TR, ['çiğdem', 'ılık']],
  ])('builds a dictionary of non-ASCII words for %s', async (locale, words) => {
    getWordList.mockResolvedValue(words);

    const gaddag = await downloadDictionary(locale);

    expect(words.map((word) => gaddag.has(word))).toEqual([true, true]);
  });

  it('builds a dictionary out of an unsorted list with duplicates', async () => {
    getWordList.mockResolvedValue(['zebra', 'apple', 'apple']);

    const gaddag = await downloadDictionary(Locale.EN_US);

    expect(gaddag.has('zebra')).toBe(true);
    expect(gaddag.has('apple')).toBe(true);
  });

  it('builds an empty dictionary out of an empty word list', async () => {
    getWordList.mockResolvedValue([]);

    const gaddag = await downloadDictionary(Locale.EN_US);

    expect(gaddag.has('scrabble')).toBe(false);
    expect(logEvent).toHaveBeenCalledWith(expect.objectContaining({ words: 0 }));
  });

  it('logs the build with the word count and rounded durations', async () => {
    getWordList.mockResolvedValue(['scrabble', 'solver']);
    const now = spyOn(performance, 'now');
    now.mockReturnValueOnce(1000).mockReturnValueOnce(1250.4).mockReturnValueOnce(1750.9);

    await downloadDictionary(Locale.EN_US);

    expect(logEvent).toHaveBeenCalledTimes(1);
    expect(logEvent).toHaveBeenCalledWith({
      build_ms: 501,
      download_ms: 250,
      locale: Locale.EN_US,
      type: 'build',
      words: 2,
    });
  });

  it('rejects without logging a build when the word list cannot be downloaded', async () => {
    const error = new Error('upstream is down');
    getWordList.mockRejectedValue(error);

    expect(await getRejection(downloadDictionary(Locale.EN_US))).toBe(error);
    expect(logEvent).not.toHaveBeenCalled();
  });
});
