import { Locale } from '@scrabble-solver/types';

import { getTxtWordList, latinizeDiacritics } from './lib';

const FILE_URL = 'https://raw.githubusercontent.com/Thecoolsim/French-Scrabble-ODS8/main/French%20ODS%20dictionary.txt';

const getFrFrWordList = async (): Promise<string[]> => {
  const words = await getTxtWordList(FILE_URL, Locale.FR_FR);
  return latinizeDiacritics(words);
};

export default getFrFrWordList;
