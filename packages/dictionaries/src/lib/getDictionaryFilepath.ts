import { type Locale } from '@scrabble-solver/types';
import path from 'path';

import { OUTPUT_DIRECTORY } from '../constants';

export const getDictionaryFilepath = (locale: Locale, directory: string = OUTPUT_DIRECTORY): string => {
  return path.resolve(directory, `${locale}.gaddag`);
};

/** Filepath of the serialized-trie cache used before the GADDAG migration (#164). */
export const getLegacyDictionaryFilepath = (locale: Locale, directory: string = OUTPUT_DIRECTORY): string => {
  return path.resolve(directory, `${locale}.txt`);
};
