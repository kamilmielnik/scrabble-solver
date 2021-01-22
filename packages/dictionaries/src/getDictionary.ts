import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';
import { getWordList } from '@scrabble-solver/word-lists';
import fs from 'fs';
import path from 'path';

import { ensureDirectoryExists, readFile, writeFile } from './lib';

const OUTPUT_DIRECTORY = 'dictionaries';

const cache: Partial<Record<Locale, Trie>> = {};

const getDictionary = async (locale: Locale): Promise<Trie> => {
  const cached = cache[locale];

  if (typeof cached !== 'undefined') {
    return cached;
  }

  ensureDirectoryExists(path.resolve(OUTPUT_DIRECTORY));
  const filepath = getDictionaryFilepath(locale);

  if (fs.existsSync(filepath)) {
    const serialized = await readFile(filepath);
    const trie = Trie.deserialize(serialized);
    cache[locale] = trie;
    return trie;
  } else {
    const trie = await downloadDictionary(locale);
    cache[locale] = trie;
    return trie;
  }
};

const downloadDictionary = async (locale: Locale): Promise<Trie> => {
  const filepath = getDictionaryFilepath(locale);
  const words = await getWordList(locale);
  const trie = Trie.fromArray(words);
  await writeFile(filepath, trie.serialize());
  return trie;
};

const getDictionaryFilepath = (locale: Locale): string => {
  return path.resolve(OUTPUT_DIRECTORY, `${locale}.txt`);
};

export default getDictionary;
