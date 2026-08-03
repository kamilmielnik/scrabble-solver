import { type Gaddag } from '@scrabble-solver/gaddag';
import { type Locale } from '@scrabble-solver/types';

import type { Cache } from '../types';

import { createCacheTimestampComparator } from './createCacheTimestampComparator';
import { DiskCache } from './DiskCache';
import { MemoryCache } from './MemoryCache';

export class LayeredCache implements Cache<Locale, Gaddag> {
  private readonly layers = [new MemoryCache(), new DiskCache()];

  public async get(locale: Locale): Promise<Gaddag | undefined> {
    const cache = this.getLastModifiedLayer(locale);

    if (!cache) {
      return Promise.resolve(undefined);
    }

    const [memoryCache, diskCache] = this.layers;
    const value = await cache.get(locale);

    if (cache === diskCache && typeof value !== 'undefined') {
      await memoryCache.set(locale, value);
    }

    return value;
  }

  public getLastModifiedTimestamp(locale: Locale): number | undefined {
    const cache = this.getLastModifiedLayer(locale);

    if (!cache) {
      return undefined;
    }

    return cache.getLastModifiedTimestamp(locale);
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

  public async set(locale: Locale, gaddag: Gaddag): Promise<void> {
    const [memoryCache, diskCache] = this.layers;
    await diskCache.set(locale, gaddag);
    await memoryCache.set(locale, gaddag);
  }

  private getLastModifiedLayer(locale: Locale): Cache<Locale, Gaddag> | undefined {
    const layers = this.layers.filter((cache) => cache.has(locale));
    const [cached] = [...layers].sort(createCacheTimestampComparator(locale));
    return cached;
  }
}
