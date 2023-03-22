import { Locale } from '@scrabble-solver/types';

import { getTxtWordList } from '../lib';

const FILE_URL = 'http://diccionari.totescrable.cat/versio/DISC2-LP.txt';

export const getWordList = async (): Promise<string[]> => {
  const words = await getTxtWordList(FILE_URL, Locale.CA_ES);
  return words.map(normalizeWord);
};

const normalizeWord = (word: string): string => {
  // normalization from https://stackoverflow.com/a/37511463
  return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};
