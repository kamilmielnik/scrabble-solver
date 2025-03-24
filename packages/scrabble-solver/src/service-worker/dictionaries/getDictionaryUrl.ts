import { Locale } from '@scrabble-solver/types';

export const getDictionaryUrl = (locale: Locale): string => {
  return `/api/dictionary/${locale}`;
};
