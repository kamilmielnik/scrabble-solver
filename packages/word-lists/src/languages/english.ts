import { Locale } from '@scrabble-solver/types';

import { getTxtWordList } from '../lib';

const EN_GB_FILE_URL =
  'https://raw.githubusercontent.com/kamilmielnik/scrabble-dictionaries/refs/heads/master/english/sowpods.txt';
const EN_US_FILE_URL =
  'https://raw.githubusercontent.com/kamilmielnik/scrabble-dictionaries/refs/heads/master/english/twl06.txt';

export const getWordListGb = async (): Promise<string[]> => {
  return getTxtWordList(EN_GB_FILE_URL, Locale.EN_GB);
};

export const getWordListUs = async (): Promise<string[]> => {
  return getTxtWordList(EN_US_FILE_URL, Locale.EN_US);
};
