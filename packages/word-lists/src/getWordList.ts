import { Locale } from '@scrabble-solver/types';

import { catalan, english, french, german, persian, polish, romanian, spanish, turkish } from './languages';

const localeMap: Record<Locale, () => Promise<string[]>> = {
  [Locale.CA_ES]: catalan.getWordList,
  [Locale.DE_DE]: german.getWordList,
  [Locale.EN_GB]: english.getWordListGb,
  [Locale.EN_US]: english.getWordListUs,
  [Locale.ES_ES]: spanish.getWordList,
  [Locale.FA_IR]: persian.getWordList,
  [Locale.FR_FR]: french.getWordList,
  [Locale.PL_PL]: polish.getWordList,
  [Locale.RO_RO]: romanian.getWordList,
  [Locale.TR_TR]: turkish.getWordList,
};

export const getWordList = (locale: Locale): Promise<string[]> => localeMap[locale]();
