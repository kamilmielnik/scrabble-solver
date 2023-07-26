import { Locale } from '@scrabble-solver/types';

import { getTxtWordList } from './lib';

const FILE_URL = 'https://raw.githubusercontent.com/kamilmielnik/french-dictionary/master/fr-FR.txt';

const getFrFrWordList = async (): Promise<string[]> => {
  const words = await getTxtWordList(FILE_URL, Locale.FR_FR);
  return words.map(normalizeWord);
};

const normalizeWord = (word: string): string => {
  // normalization from https://stackoverflow.com/a/37511463
  return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export default getFrFrWordList;
