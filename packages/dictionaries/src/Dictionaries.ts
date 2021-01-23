import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';
import path from 'path';

import { OUTPUT_DIRECTORY } from './constants';
import { createAsyncProxy, downloadDictionary, ensureDirectoryExists, LayeredCache } from './lib';
import { Cache } from './types';

class Dictionaries {
  private readonly cache: Cache<Locale, Trie>;
  private readonly downloadDictionaryProxies: Record<Locale, () => Promise<Trie>>;

  constructor() {
    this.cache = new LayeredCache();
    this.downloadDictionaryProxies = Object.fromEntries(
      Object.values(Locale).map((locale) => [locale, createAsyncProxy(() => downloadDictionary(locale))]),
    ) as Record<Locale, () => Promise<Trie>>;
  }

  public async get(locale: Locale): Promise<Trie> {
    if (this.cache.has(locale)) {
      const trie = await this.cache.get(locale);

      if (trie) {
        return trie;
      }
    }

    return this.updateDictionary(locale);
  }

  public async update(force?: boolean): Promise<void> {
    const staleLocales = force ? Object.values(Locale) : this.getStaleLocales();
    await Promise.all(staleLocales.map((locale) => this.updateDictionary(locale)));
  }

  private getStaleLocales(): Locale[] {
    return Object.values(Locale).filter((locale) => this.cache.isStale(locale));
  }

  private async updateDictionary(locale: Locale): Promise<Trie> {
    ensureDirectoryExists(path.resolve(OUTPUT_DIRECTORY));
    const downloadDictionaryProxy = this.downloadDictionaryProxies[locale];
    const trie = await downloadDictionaryProxy();
    await this.cache.set(locale, trie);
    return trie;
  }
}

export default Dictionaries;
