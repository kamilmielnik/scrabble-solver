import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';
import fs from 'fs';

import Cache from './Cache';
import { getDictionaryFilepath, readFile, writeFile } from './lib';

class DiskCache implements Cache {
  public has(locale: Locale): boolean {
    const filepath = getDictionaryFilepath(locale);
    return fs.existsSync(filepath);
  }

  public async get(locale: Locale): Promise<Trie | undefined> {
    if (!this.has(locale)) {
      return undefined;
    }

    const filepath = getDictionaryFilepath(locale);
    const serialized = await readFile(filepath);
    const trie = Trie.deserialize(serialized);
    return trie;
  }

  public async set(locale: Locale, trie: Trie): Promise<void> {
    const filepath = getDictionaryFilepath(locale);
    await writeFile(filepath, trie.serialize());
  }
}

export default DiskCache;
