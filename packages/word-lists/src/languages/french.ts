import { Locale } from '@scrabble-solver/types';

import { getTxtWordList, transliterateDiacritics } from '../lib';

const FILE_URL =
  'https://raw.githubusercontent.com/kamilmielnik/scrabble-dictionaries/refs/heads/master/french/ods8.txt';

export const getWordList = async (): Promise<string[]> => {
  const words = await getTxtWordList(FILE_URL, Locale.FR_FR);
  return transliterateDiacritics(words);
};
