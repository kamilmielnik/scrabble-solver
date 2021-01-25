import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';

import { Cache } from '../types';

import createCacheTimestampComparator from './createCacheTimestampComparator';
import DiskCache from './DiskCache';
import MemoryCache from './MemoryCache';

class LayeredCache implements Cache<Locale, Trie> {
  private readonly layers = [new MemoryCache(), new DiskCache()];

  public get(locale: Locale): Promise<Trie | undefined> {
    const cached = this.getLastModifiedLayer(locale);

    if (!cached) {
      return Promise.resolve(undefined);
    }

    return cached.get(locale);
  }

  public getLastModifiedTimestamp(locale: Locale): number | undefined {
    const cached = this.getLastModifiedLayer(locale);

    if (!cached) {
      return undefined;
    }

    return cached.getLastModifiedTimestamp(locale);
  }

  public has(locale: Locale): boolean {
    return this.layers.some((cache) => cache.has(locale));
  }

  public isStale(locale: Locale): boolean | undefined {
    if (this.layers.some((cache) => cache.isStale(locale))) {
      return true;
    }

    if (this.layers.every((cache) => typeof cache.isStale(locale) === 'undefined')) {
      return undefined;
    }

    return false;
  }

  public async set(locale: Locale, trie: Trie): Promise<void> {
    await Promise.all(this.layers.map((cache) => cache.set(locale, trie)));
  }

  private getLastModifiedLayer(locale: Locale): Cache<Locale, Trie> | undefined {
    const layers = this.layers.filter((cache) => cache.has(locale));
    const [cached] = [...layers].sort(createCacheTimestampComparator(locale));
    return cached;
  }
}

export default LayeredCache;
