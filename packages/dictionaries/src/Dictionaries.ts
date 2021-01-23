import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';
import path from 'path';

import { OUTPUT_DIRECTORY } from './constants';
import { createDownloadDictionaryProxies, ensureDirectoryExists, LayeredCache } from './lib';
import { Cache } from './types';

class Dictionaries {
  private readonly cache: Cache<Locale, Trie>;
  private readonly downloadDictionaryProxies: Record<Locale, () => Promise<Trie>>;

  constructor() {
    this.cache = new LayeredCache();
    this.downloadDictionaryProxies = createDownloadDictionaryProxies(this.cache);
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

  private updateDictionary(locale: Locale): Promise<Trie> {
    const downloadDictionary = this.downloadDictionaryProxies[locale];
    ensureDirectoryExists(path.resolve(OUTPUT_DIRECTORY));
    return downloadDictionary();
  }
}

export default Dictionaries;
