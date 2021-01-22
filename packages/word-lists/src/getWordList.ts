import { Locale } from '@scrabble-solver/types';

import getEnUsWordList from './getEnUsWordList';
import getEnGbWordList from './getEnGbWordList';
import getFrFrWordList from './getFrFrWordList';
import getPlPlWordList from './getPlPlWordList';

const localeMap: Record<Locale, () => Promise<string[]>> = {
  'en-GB': getEnGbWordList,
  'en-US': getEnUsWordList,
  'fr-FR': getFrFrWordList,
  'pl-PL': getPlPlWordList,
};

const getWordList = (locale: Locale): Promise<string[]> => localeMap[locale]();

export default getWordList;
