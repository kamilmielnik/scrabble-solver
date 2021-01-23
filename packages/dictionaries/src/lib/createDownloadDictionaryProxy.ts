import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';

import Cache from './Cache';
import downloadDictionary from './downloadDictionary';

const createDownloadDictionaryProxy = (cache: Cache<Locale, Trie>, locale: Locale) => {
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

export default createDownloadDictionaryProxy;
