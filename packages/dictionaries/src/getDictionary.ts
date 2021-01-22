import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';
import { getWordList } from '@scrabble-solver/word-lists';
import path from 'path';

import { OUTPUT_DIRECTORY } from './constants';
import { ensureDirectoryExists, LayeredCache } from './lib';

const cache = new LayeredCache();
const dictionaryPromises: Partial<Record<Locale, Promise<Trie>>> = {};

const getDictionary = async (locale: Locale): Promise<Trie> => {
  if (cache.has(locale)) {
    const trie = await cache.get(locale);

    if (cache.isStale(locale)) {
      getOrCreateDictionaryPromise(locale);
    }

    return trie!;
  } else {
    ensureDirectoryExists(path.resolve(OUTPUT_DIRECTORY));
    return getOrCreateDictionaryPromise(locale);
  }
};

const getOrCreateDictionaryPromise = async (locale: Locale): Promise<Trie> => {
  const dictionaryPromise = dictionaryPromises[locale] || downloadDictionary(locale);
  dictionaryPromises[locale] = dictionaryPromise;
  const trie = await dictionaryPromise;
  return trie;
};

const downloadDictionary = async (locale: Locale): Promise<Trie> => {
  const words = await getWordList(locale);
  const trie = Trie.fromArray(words);
  cache.set(locale, trie);
  return trie;
};

export default getDictionary;
