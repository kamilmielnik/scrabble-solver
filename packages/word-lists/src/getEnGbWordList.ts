import { Locale } from '@scrabble-solver/types';

import { getTxtWordList } from './lib';

const FILE_URL = 'https://www.wordgamedictionary.com/sowpods/download/sowpods.txt';

const getEnGbWordList = async (): Promise<string[]> => {
  return getTxtWordList(FILE_URL, Locale.EN_GB);
};

export default getEnGbWordList;
