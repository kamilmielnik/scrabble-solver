import { describe, expect, it, mock } from 'bun:test';

import type * as DictionariesModule from './Dictionaries';
import { redirectOutputDirectory } from './test/redirectOutputDirectory';

import type * as indexModule from './index';

await mock.module('@scrabble-solver/logger', () => ({ logError: mock(), logEvent: mock() }));
await mock.module('@scrabble-solver/word-lists', () => ({ getWordList: mock() }));

await redirectOutputDirectory();

const { Dictionaries }: typeof DictionariesModule = await import('./Dictionaries');
const api: typeof indexModule = await import('./index');

describe('index', () => {
  it('exposes a ready to use Dictionaries instance', () => {
    expect(api.dictionaries).toBeInstanceOf(Dictionaries);
  });

  it('exposes the building blocks of the cache', () => {
    expect(Object.keys(api).toSorted()).toEqual([
      'DiskCache',
      'LayeredCache',
      'MemoryCache',
      'createAsyncProxy',
      'createCacheTimestampComparator',
      'dictionaries',
      'downloadDictionary',
      'getDictionaryFilepath',
    ]);
  });
});
