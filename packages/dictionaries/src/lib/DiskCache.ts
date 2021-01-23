import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';
import fs from 'fs';

import { CACHE_STALE_THRESHOLD } from '../constants';
import { Cache } from '../types';

import getDictionaryFilepath from './getDictionaryFilepath';
import readFile from './readFile';
import writeFile from './writeFile';

class DiskCache implements Cache<Locale, Trie> {
  public async get(locale: Locale): Promise<Trie | undefined> {
    if (!this.has(locale)) {
      return undefined;
    }

    const filepath = getDictionaryFilepath(locale);
    const serialized = await readFile(filepath);
    const trie = Trie.deserialize(serialized);
    return trie;
  }

  public has(locale: Locale): boolean {
    const filepath = getDictionaryFilepath(locale);
    return fs.existsSync(filepath);
  }

  public isStale(locale: Locale): boolean {
    if (!this.has(locale)) {
      return true;
    }

    const filepath = getDictionaryFilepath(locale);
    const stats = fs.statSync(filepath);
    const timeSinceModification = Math.abs(stats.mtimeMs - Date.now());
    return timeSinceModification > CACHE_STALE_THRESHOLD;
  }

  public async set(locale: Locale, trie: Trie): Promise<void> {
    const filepath = getDictionaryFilepath(locale);
    await writeFile(filepath, trie.serialize());
  }
}

export default DiskCache;
