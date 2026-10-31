import { Gaddag } from '@kamilmielnik/gaddag';
import { logError } from '@scrabble-solver/logger';
import { type Locale } from '@scrabble-solver/types';
import fs from 'fs';
import path from 'path';

import { CACHE_STALE_THRESHOLD, OUTPUT_DIRECTORY } from '../constants';
import type { Cache } from '../types';

import { getDictionaryFilepath } from './getDictionaryFilepath';

const TEMPORARY_FILE_EXTENSION = '.tmp';

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
      logError('cache', error, { level: 'warn', locale });
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
    const temporaryFilepath = `${filepath}.${crypto.randomUUID()}${TEMPORARY_FILE_EXTENSION}`;
    this.removeAbandonedTemporaryFiles();

    try {
      await fs.promises.writeFile(temporaryFilepath, gaddag.serialize());
      await fs.promises.rename(temporaryFilepath, filepath);
    } finally {
      await fs.promises.rm(temporaryFilepath, { force: true });
    }
  }

  private removeAbandonedTemporaryFiles(): void {
    try {
      for (const filename of fs.readdirSync(this.directory)) {
        const filepath = path.join(this.directory, filename);

        if (filename.endsWith(TEMPORARY_FILE_EXTENSION) && isAbandoned(filepath)) {
          fs.rmSync(filepath, { force: true });
        }
      }
    } catch (error) {
      logError('cache', error, { level: 'warn' });
    }
  }
}

function isAbandoned(temporaryFilepath: string): boolean {
  const stats = fs.statSync(temporaryFilepath, { throwIfNoEntry: false });
  return typeof stats !== 'undefined' && Date.now() - stats.mtimeMs > CACHE_STALE_THRESHOLD;
}
