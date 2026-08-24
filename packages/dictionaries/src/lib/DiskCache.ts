import { Gaddag } from '@kamilmielnik/gaddag';
import { logEvent } from '@scrabble-solver/logger';
import { type Locale, isError } from '@scrabble-solver/types';
import fs from 'fs';

import { CACHE_STALE_THRESHOLD, OUTPUT_DIRECTORY } from '../constants';
import type { Cache } from '../types';

import { getDictionaryFilepath, getLegacyDictionaryFilepath } from './getDictionaryFilepath';

export class DiskCache implements Cache<Locale, Gaddag> {
  private readonly directory: string;

  constructor(directory: string = OUTPUT_DIRECTORY) {
    this.directory = directory;
  }

  /**
   * Returns undefined when the cached file cannot be deserialized (it was
   * written by an app version with an incompatible format, or it is corrupted)
   * so that callers re-download and re-serialize the dictionary.
   */
  public async get(locale: Locale): Promise<Gaddag | undefined> {
    if (!this.has(locale)) {
      return undefined;
    }

    const filepath = getDictionaryFilepath(locale, this.directory);

    try {
      const serialized = await fs.promises.readFile(filepath);
      return Gaddag.deserialize(new Uint8Array(serialized.buffer, serialized.byteOffset, serialized.byteLength));
    } catch (error) {
      logEvent({
        type: 'error',
        level: 'warn',
        operation: 'cache',
        locale,
        message: isError(error) ? error.message : 'Unknown error',
      });
      await fs.promises.rm(filepath, { force: true });
      return undefined;
    }
  }

  public getLastModifiedTimestamp(locale: Locale): number | undefined {
    const filepath = getDictionaryFilepath(locale, this.directory);

    if (!fs.existsSync(filepath)) {
      return undefined;
    }

    const stats = fs.statSync(filepath);
    return stats.mtimeMs;
  }

  public has(locale: Locale): boolean {
    const filepath = getDictionaryFilepath(locale, this.directory);
    return fs.existsSync(filepath);
  }

  public isStale(locale: Locale): boolean | undefined {
    if (!this.has(locale)) {
      return undefined;
    }

    const lastModifiedTimestamp = this.getLastModifiedTimestamp(locale);

    if (typeof lastModifiedTimestamp === 'undefined') {
      return undefined;
    }

    const timeSinceModification = Math.abs(lastModifiedTimestamp - Date.now());
    return timeSinceModification > CACHE_STALE_THRESHOLD;
  }

  public async set(locale: Locale, gaddag: Gaddag): Promise<void> {
    const filepath = getDictionaryFilepath(locale, this.directory);
    await fs.promises.writeFile(filepath, gaddag.serialize());
    // Serialized-trie cache from before the GADDAG migration - remove this in #437
    await fs.promises.rm(getLegacyDictionaryFilepath(locale, this.directory), { force: true });
  }
}
