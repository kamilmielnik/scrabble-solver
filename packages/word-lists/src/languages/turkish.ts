import { Locale } from '@scrabble-solver/types';

import { getTxtWordList } from '../lib';

const FILE_URL = 'https://raw.githubusercontent.com/kamilmielnik/scrabble-dictionaries/master/turkish/kelimelik.txt';

export const getWordList = async (): Promise<string[]> => {
  return getTxtWordList(FILE_URL, Locale.TR_TR);
};
