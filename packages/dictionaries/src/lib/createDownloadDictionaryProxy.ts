import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';

import downloadDictionary from './downloadDictionary';

const createDownloadDictionaryProxy = (locale: Locale) => {
  let promise: Promise<Trie> | null = null;

  return async (): Promise<Trie> => {
    if (promise) {
      return promise;
    }

    try {
      promise = downloadDictionary(locale);
      const trie = await promise;
      return trie;
    } finally {
      promise = null;
    }
  };
};

export default createDownloadDictionaryProxy;
