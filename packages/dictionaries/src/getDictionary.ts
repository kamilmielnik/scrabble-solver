import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';
import { getWordList } from '@scrabble-solver/word-lists';
import path from 'path';

import { OUTPUT_DIRECTORY } from './constants';
import { Cache, ensureDirectoryExists, LayeredCache } from './lib';

const createGetDictionary = () => {
  const cache = new LayeredCache();
  const downloadDictionaryProxies = createDownloadDictionaryProxies(cache);

  return async (locale: Locale): Promise<Trie> => {
    const downloadDictionaryProxy = downloadDictionaryProxies[locale];

    if (cache.has(locale)) {
      const trie = await cache.get(locale);

      if (cache.isStale(locale)) {
        downloadDictionaryProxy();
      }

      return trie!;
    } else {
      ensureDirectoryExists(path.resolve(OUTPUT_DIRECTORY));
      return downloadDictionaryProxy();
    }
  };
};

const createDownloadDictionaryProxies = (cache: Cache): Record<Locale, () => Promise<Trie>> => {
  const locales = Object.values(Locale);
  const entries = locales.map((locale) => [locale, createDownloadDictionaryProxy(cache, locale)]);
  const downloadDictionaryProxies = Object.fromEntries(entries);
  return downloadDictionaryProxies;
};

const createDownloadDictionaryProxy = (cache: Cache, locale: Locale) => {
  let promise: Promise<Trie> | null = null;

  return async (): Promise<Trie> => {
    if (promise) {
      return promise;
    }

    try {
      promise = downloadDictionary(locale);
      const trie = await promise;
      cache.set(locale, trie);
      return trie;
    } finally {
      promise = null;
    }
  };
};

const downloadDictionary = async (locale: Locale): Promise<Trie> => {
  const words = await getWordList(locale);
  const trie = Trie.fromArray(words);
  return trie;
};

export default createGetDictionary();
