import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';

import { CACHE_STALE_THRESHOLD } from '../constants';
import { Cache } from '../types';

export class MemoryCache implements Cache<Locale, Trie> {
  private readonly cache: Partial<Record<Locale, Trie>> = {};

  private readonly cacheTimestamps: Partial<Record<Locale, number>> = {};

  public get(locale: Locale): Promise<Trie | undefined> {
    return Promise.resolve(this.cache[locale]);
  }

  public getLastModifiedTimestamp(locale: Locale): number | undefined {
    return this.cacheTimestamps[locale];
  }

  public has(locale: Locale): boolean {
    return typeof this.cache[locale] !== 'undefined';
  }

  public isStale(locale: Locale): boolean | undefined {
    const timestamp = this.getLastModifiedTimestamp(locale);

    if (!this.has(locale) || typeof timestamp === 'undefined') {
      return undefined;
    }

    const timeSinceModification = Math.abs(timestamp - Date.now());
    return timeSinceModification > CACHE_STALE_THRESHOLD;
  }

  public set(locale: Locale, trie: Trie): Promise<void> {
    this.cacheTimestamps[locale] = Date.now();
    this.cache[locale] = trie;
    return Promise.resolve();
  }
}
