import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';

import Cache from './Cache';
import DiskCache from './DiskCache';
import MemoryCache from './MemoryCache';

class LayeredCache implements Cache {
  private readonly layers = [new MemoryCache(), new DiskCache()];

  public get(locale: Locale): Promise<Trie | undefined> {
    const cache = this.layers.find((cache) => cache.has(locale));

    if (!cache) {
      return Promise.resolve(undefined);
    }

    return cache.get(locale);
  }

  public has(locale: Locale): boolean {
    return this.layers.some((cache) => cache.has(locale));
  }

  public isStale(locale: Locale): boolean {
    return this.layers.some((cache) => cache.isStale(locale));
  }

  public async set(locale: Locale, trie: Trie): Promise<void> {
    for (const cache of this.layers) {
      await cache.set(locale, trie);
    }
  }
}

export default LayeredCache;
