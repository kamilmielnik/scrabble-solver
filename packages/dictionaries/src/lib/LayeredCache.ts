import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';

import { Cache } from '../types';

import DiskCache from './DiskCache';
import MemoryCache from './MemoryCache';

class LayeredCache implements Cache<Locale, Trie> {
  private readonly layers = [new MemoryCache(), new DiskCache()];

  public get(locale: Locale): Promise<Trie | undefined> {
    const cached = this.layers.find((cache) => cache.has(locale));

    if (!cached) {
      return Promise.resolve(undefined);
    }

    return cached.get(locale);
  }

  public has(locale: Locale): boolean {
    return this.layers.some((cache) => cache.has(locale));
  }

  public isStale(locale: Locale): boolean {
    return this.layers.some((cache) => cache.isStale(locale));
  }

  public async set(locale: Locale, trie: Trie): Promise<void> {
    await Promise.all(this.layers.map((cache) => cache.set(locale, trie)));
  }
}

export default LayeredCache;
