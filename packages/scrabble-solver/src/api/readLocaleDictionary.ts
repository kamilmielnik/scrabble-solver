import { Trie } from '@kamilmielnik/trie';
import fs from 'fs';
import path from 'path';

import { Locale } from 'types';

const dictionariesDirectory = path.resolve('../../dictionaries');

const readLocaleDictionary = (locale: Locale): Trie => {
  return Trie.deserialize(fs.readFileSync(path.join(dictionariesDirectory, `${locale}.txt`), 'utf-8'));
};

export default readLocaleDictionary;
