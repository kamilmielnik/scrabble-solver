import { type Gaddag } from '@kamilmielnik/gaddag';
import { Locale } from '@scrabble-solver/types';
import { describe, expect, it } from 'bun:test';

import type { Cache } from '../types';

import { createCacheTimestampComparator } from './createCacheTimestampComparator';

const LOCALE = Locale.EN_US;

describe('createCacheTimestampComparator', () => {
  const compare = createCacheTimestampComparator(LOCALE);

  it('considers caches modified at the same time equal', () => {
    expect(compare(createCache(1000), createCache(1000))).toBe(0);
  });

  it('considers two caches without the entry equal', () => {
    expect(compare(createCache(undefined), createCache(undefined))).toBe(0);
  });

  it('orders the more recently modified cache first', () => {
    expect(compare(createCache(2000), createCache(1000))).toBeLessThan(0);
    expect(compare(createCache(1000), createCache(2000))).toBeGreaterThan(0);
  });

  it('orders a cache without the entry after a cache with it', () => {
    expect(compare(createCache(undefined), createCache(1000))).toBeGreaterThan(0);
    expect(compare(createCache(1000), createCache(undefined))).toBeLessThan(0);
  });

  it('does not mistake the epoch for a missing entry', () => {
    expect(compare(createCache(0), createCache(undefined))).toBeLessThan(0);
  });

  it('reads the timestamp of the given locale', () => {
    const cache = createCache(1000);
    const timestamps = new Map([[Locale.PL_PL, 3000]]);
    cache.getLastModifiedTimestamp = (locale) => timestamps.get(locale);
    const comparePolish = createCacheTimestampComparator(Locale.PL_PL);

    expect(comparePolish(cache, createCache(2000))).toBeLessThan(0);
  });

  it('sorts caches from the newest, leaving caches without the entry last', () => {
    const newest = createCache(3000);
    const oldest = createCache(1000);
    const missing = createCache(undefined);

    expect([missing, oldest, newest].sort(compare)).toEqual([newest, oldest, missing]);
  });
});

function createCache(timestamp: number | undefined): Cache<Locale, Gaddag> {
  return {
    get: () => Promise.resolve(undefined),
    getLastModifiedTimestamp: () => timestamp,
    has: () => typeof timestamp !== 'undefined',
    isStale: () => undefined,
    set: () => Promise.resolve(),
  };
}
