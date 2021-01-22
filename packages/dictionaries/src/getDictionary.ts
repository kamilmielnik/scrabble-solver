import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';
import { getWordList } from '@scrabble-solver/word-lists';
import path from 'path';

import { OUTPUT_DIRECTORY } from './constants';
import { ensureDirectoryExists } from './lib';

import LayeredCache from './LayeredCache';

const cache = new LayeredCache();

const getDictionary = async (locale: Locale): Promise<Trie> => {
  if (cache.has(locale)) {
    const trie = await cache.get(locale);
    return trie!;
  } else {
    ensureDirectoryExists(path.resolve(OUTPUT_DIRECTORY));

    const trie = await downloadDictionary(locale);
    cache.set(locale, trie);
    return trie;
  }
};

const downloadDictionary = async (locale: Locale): Promise<Trie> => {
  const words = await getWordList(locale);
  const trie = Trie.fromArray(words);
  return trie;
};

export default getDictionary;
