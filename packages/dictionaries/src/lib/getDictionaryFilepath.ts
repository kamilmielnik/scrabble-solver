import { Locale } from '@scrabble-solver/types';
import path from 'path';

import { OUTPUT_DIRECTORY } from '../constants';

export const getDictionaryFilepath = (locale: Locale): string => {
  return path.resolve(OUTPUT_DIRECTORY, `${locale}.txt`);
};
