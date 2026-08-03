import { type Gaddag } from '@kamilmielnik/gaddag';
import { logger } from '@scrabble-solver/logger';
import { Locale } from '@scrabble-solver/types';
import fs from 'fs';

import { OUTPUT_DIRECTORY } from './constants';
import { createAsyncProxy, downloadDictionary, LayeredCache } from './lib';
import { type Cache } from './types';

export class Dictionaries {
  private readonly cache: Cache<Locale, Gaddag>;

  private readonly downloadDictionaryProxies: Record<Locale, () => Promise<Gaddag>>;

  constructor() {
    this.cache = new LayeredCache();
    this.downloadDictionaryProxies = Object.fromEntries(
      Object.values(Locale).map((locale) => [locale, createAsyncProxy(() => downloadDictionary(locale))]),
    ) as Record<Locale, () => Promise<Gaddag>>;
  }

  public async get(locale: Locale): Promise<Gaddag> {
    if (this.cache.has(locale)) {
      const gaddag = await this.cache.get(locale);

      if (gaddag) {
        return gaddag;
      }
    }

    logger.info('Dictionaries - cache miss', { locale });
    return this.updateDictionary(locale);
  }

  public remove(): void {
    // @ts-expect-error incorrect @types/node? https://nodejs.org/docs/latest-v25.x/api/fs.html#fsrmdirsyncpath-options
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

  private async updateDictionary(locale: Locale): Promise<Gaddag> {
    logger.info('Dictionaries - updateDictionary', { locale });
    fs.mkdirSync(OUTPUT_DIRECTORY, { recursive: true });
    const downloadDictionaryProxy = this.downloadDictionaryProxies[locale];
    const gaddag = await downloadDictionaryProxy();
    await this.cache.set(locale, gaddag);
    return gaddag;
  }
}
