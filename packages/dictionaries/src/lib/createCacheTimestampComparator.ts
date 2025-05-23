import { type Trie } from '@kamilmielnik/trie';
import { type Locale } from '@scrabble-solver/types';

import type { Cache } from '../types';

export const createCacheTimestampComparator = (locale: Locale) => {
  return (a: Cache<Locale, Trie>, b: Cache<Locale, Trie>): number => {
    const aTimestamp = a.getLastModifiedTimestamp(locale);
    const bTimestamp = b.getLastModifiedTimestamp(locale);

    if (aTimestamp === bTimestamp) {
      return 0;
    }

    if (typeof aTimestamp === 'undefined') {
      return 1;
    }

    if (typeof bTimestamp === 'undefined') {
      return -1;
    }

    return bTimestamp - aTimestamp;
  };
};
