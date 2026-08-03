import { type Gaddag } from '@kamilmielnik/gaddag';
import { type Locale } from '@scrabble-solver/types';

import type { Cache } from '../types';

export const createCacheTimestampComparator = (locale: Locale) => {
  return (a: Cache<Locale, Gaddag>, b: Cache<Locale, Gaddag>): number => {
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
