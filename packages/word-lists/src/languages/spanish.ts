import { Locale } from '@scrabble-solver/types';

import { getTxtWordList, transliterateDiacritics } from '../lib';

const FILE_URL = 'https://raw.githubusercontent.com/kamilmielnik/scrabble-dictionaries/master/spanish/file-2017.txt';

export const getWordList = async (): Promise<string[]> => {
  const words = await getTxtWordList(FILE_URL, Locale.ES_ES);
  return transliterateDiacritics(words, { ignore: ['ñ'] });
};
