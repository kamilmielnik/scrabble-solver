import { Locale } from '@scrabble-solver/types';
import path from 'path';

import { DICTIONARIES_DIRECTORY } from '../constants';

const getDictionaryFilepath = (locale: Locale): string => {
  return path.resolve(DICTIONARIES_DIRECTORY, `${locale}.txt`);
};

export default getDictionaryFilepath;
