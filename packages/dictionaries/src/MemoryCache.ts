import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';

import Cache from './Cache';

class MemoryCache implements Cache {
  private readonly cache: Partial<Record<Locale, Trie>> = {};

  public has(locale: Locale): boolean {
    const cached = this.cache[locale];
    return typeof cached !== 'undefined';
  }

  public get(locale: Locale): Promise<Trie | undefined> {
    return Promise.resolve(this.cache[locale]);
  }

  public set(locale: Locale, trie: Trie): Promise<void> {
    this.cache[locale] = trie;
    return Promise.resolve();
  }
}

export default MemoryCache;
