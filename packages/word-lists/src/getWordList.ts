import { Locale } from '@scrabble-solver/types';

import { english, french, german, persian, polish, romanian, spanish } from './languages';

const localeMap: Record<Locale, () => Promise<string[]>> = {
  [Locale.DE_DE]: german.getWordList,
  [Locale.EN_GB]: english.getWordListGb,
  [Locale.EN_US]: english.getWordListUs,
  [Locale.ES_ES]: spanish.getWordList,
  [Locale.FA_IR]: persian.getWordList,
  [Locale.FR_FR]: french.getWordList,
  [Locale.PL_PL]: polish.getWordList,
  [Locale.RO_RO]: romanian.getWordList,
};

export const getWordList = (locale: Locale): Promise<string[]> => localeMap[locale]();
