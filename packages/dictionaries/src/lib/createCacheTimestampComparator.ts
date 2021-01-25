import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';

import { Cache } from '../types';

const createCacheTimestampComparator = (locale: Locale) => (a: Cache<Locale, Trie>, b: Cache<Locale, Trie>): number => {
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

export default createCacheTimestampComparator;
