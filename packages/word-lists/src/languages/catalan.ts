import { Locale } from '@scrabble-solver/types';

import { getTxtWordList, transliterateDiacritics } from '../lib';

const FILE_URL = 'https://raw.githubusercontent.com/kamilmielnik/scrabble-dictionaries/master/catalan/disc.txt';

export async function getWordList(): Promise<string[]> {
  const words = await getTxtWordList(FILE_URL, Locale.CA_ES);
  return transliterateDiacritics(words, { ignore: ['ç', '·'] });
}
