import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';
import fs from 'fs';

import { CACHE_STALE_THRESHOLD } from '../constants';
import { Cache } from '../types';

import getDictionaryFilepath from './getDictionaryFilepath';

class DiskCache implements Cache<Locale, Trie> {
  public async get(locale: Locale): Promise<Trie | undefined> {
    if (!this.has(locale)) {
      return undefined;
    }

    const filepath = getDictionaryFilepath(locale);
    const serialized = await fs.promises.readFile(filepath, 'utf-8');
    const trie = Trie.deserialize(serialized);
    return trie;
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

  public async set(locale: Locale, trie: Trie): Promise<void> {
    const filepath = getDictionaryFilepath(locale);
    await fs.promises.writeFile(filepath, trie.serialize());
  }
}

export default DiskCache;
