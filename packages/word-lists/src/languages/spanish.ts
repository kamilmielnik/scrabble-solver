import { Locale } from '@scrabble-solver/types';
import latinize from 'latinize';

import { getTxtWordList } from '../lib';

const FILE_URL = 'https://raw.githubusercontent.com/kamilmielnik/scrabble-dictionaries/master/spanish/fise-2.txt';
const N_PLACEHOLDER = '---n---';

export const getWordList = async (): Promise<string[]> => {
  const words = await getTxtWordList(FILE_URL, Locale.ES_ES);

  return words
    .map((word) => word.replaceAll('ñ', N_PLACEHOLDER))
    .map(latinize)
    .map((word) => word.replaceAll(N_PLACEHOLDER, 'ñ'));
};
