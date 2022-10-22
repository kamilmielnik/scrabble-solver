import { Locale } from '@scrabble-solver/types';

const getDictionaryUrl = (locale: Locale): string => {
  return `/api/dictionary/${locale}`;
};

export default getDictionaryUrl;
