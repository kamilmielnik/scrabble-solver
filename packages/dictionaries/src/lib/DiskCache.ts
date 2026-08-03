import { Gaddag } from '@scrabble-solver/gaddag';
import { type Locale } from '@scrabble-solver/types';
import fs from 'fs';

import { CACHE_STALE_THRESHOLD } from '../constants';
import type { Cache } from '../types';

import { getDictionaryFilepath } from './getDictionaryFilepath';

export class DiskCache implements Cache<Locale, Gaddag> {
  public async get(locale: Locale): Promise<Gaddag | undefined> {
    if (!this.has(locale)) {
      return undefined;
    }

    const filepath = getDictionaryFilepath(locale);
    const serialized = await fs.promises.readFile(filepath);
    const gaddag = Gaddag.deserialize(new Uint8Array(serialized.buffer, serialized.byteOffset, serialized.byteLength));
    return gaddag;
  }

  public getLastModifiedTimestamp(locale: Locale): number | undefined {
    const filepath = getDictionaryFilepath(locale);

    if (!fs.existsSync(filepath)) {
      return undefined;
    }

    const stats = fs.statSync(filepath);
    return stats.mtimeMs;
  }

  public has(locale: Locale): boolean {
    const filepath = getDictionaryFilepath(locale);
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
    const filepath = getDictionaryFilepath(locale);
    await fs.promises.writeFile(filepath, gaddag.serialize());
  }
}
