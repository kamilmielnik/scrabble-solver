import { Locale } from '@scrabble-solver/types';

import getEnGbWordList from './getEnGbWordList';
import getEnUsWordList from './getEnUsWordList';
import getEsEsWordList from './getEsEsWordList';
import getFrFrWordList from './getFrFrWordList';
import getPlPlWordList from './getPlPlWordList';
import getDeDeWordList from './getDeDeWordList';

const localeMap: Record<Locale, () => Promise<string[]>> = {
  [Locale.EN_GB]: getEnGbWordList,
  [Locale.EN_US]: getEnUsWordList,
  [Locale.ES_ES]: getEsEsWordList,
  [Locale.FR_FR]: getFrFrWordList,
  [Locale.PL_PL]: getPlPlWordList,
  [Locale.DE_DE]: getDeDeWordList,
};

const getWordList = (locale: Locale): Promise<string[]> => localeMap[locale]();

export default getWordList;
