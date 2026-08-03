import { Gaddag } from '@scrabble-solver/gaddag';
import { type Locale } from '@scrabble-solver/types';

import { getDictionary } from './dictionaries';

export const getGaddag = async (locale: Locale): Promise<Gaddag | undefined> => {
  const dictionary = await getDictionary(locale);

  if (typeof dictionary === 'undefined') {
    return undefined;
  }

  return Gaddag.deserialize(dictionary);
};
