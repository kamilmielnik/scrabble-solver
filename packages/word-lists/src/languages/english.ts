import { Locale } from '@scrabble-solver/types';

import { getTxtWordList } from '../lib';

const EN_GB_FILE_URL = 'https://www.wordgamedictionary.com/sowpods/download/sowpods.txt';
const EN_US_FILE_URL = 'https://www.wordgamedictionary.com/twl06/download/twl06.txt';

export const getWordListGb = async (): Promise<string[]> => {
  return getTxtWordList(EN_GB_FILE_URL, Locale.EN_GB);
};

export const getWordListUs = async (): Promise<string[]> => {
  return getTxtWordList(EN_US_FILE_URL, Locale.EN_US);
};
