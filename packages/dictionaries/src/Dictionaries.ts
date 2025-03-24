import { Trie } from '@kamilmielnik/trie';
import { logger } from '@scrabble-solver/logger';
import { Locale } from '@scrabble-solver/types';
import fs from 'fs';

import { OUTPUT_DIRECTORY } from './constants';
import { createAsyncProxy, downloadDictionary, LayeredCache } from './lib';
import { Cache } from './types';

export class Dictionaries {
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

    logger.info('Dictionaries - cache miss', { locale });
    return this.updateDictionary(locale);
  }

  public remove(): void {
    fs.rmdirSync(OUTPUT_DIRECTORY, { recursive: true });
  }

  public async update(force?: boolean): Promise<void> {
    const locales = force ? Object.values(Locale) : this.getLocalesToUpdate();
    logger.info('Dictionaries - update', { force, locales });
    await Promise.all(locales.map((locale) => this.updateDictionary(locale)));
  }

  private getLocalesToUpdate(): Locale[] {
    return Object.values(Locale).filter((locale) => this.cache.isStale(locale) !== false);
  }

  private async updateDictionary(locale: Locale): Promise<Trie> {
    logger.info('Dictionaries - updateDictionary', { locale });
    fs.mkdirSync(OUTPUT_DIRECTORY, { recursive: true });
    const downloadDictionaryProxy = this.downloadDictionaryProxies[locale];
    const trie = await downloadDictionaryProxy();
    await this.cache.set(locale, trie);
    return trie;
  }
}
