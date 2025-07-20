import { Locale } from '@scrabble-solver/types';

import { getTxtWordList } from '../lib';

const FILE_URL =
  'https://raw.githubusercontent.com/kamilmielnik/scrabble-dictionaries/refs/heads/master/german/german.txt';

export const getWordList = async (): Promise<string[]> => {
  return getTxtWordList(FILE_URL, Locale.DE_DE);
};
