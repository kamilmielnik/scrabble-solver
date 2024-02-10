import { Locale } from '@scrabble-solver/types';

import { getTxtWordList, latinizeDiacritics } from '../lib';

const FILE_URL = 'https://raw.githubusercontent.com/kamilmielnik/scrabble-dictionaries/master/romanian/loc-5.0.txt';

export const getWordList = async (): Promise<string[]> => {
  const words = await getTxtWordList(FILE_URL, Locale.RO_RO);
  return latinizeDiacritics(words);
};
