import { Locale } from '@scrabble-solver/types';

const isUpperCase = (locale: Locale, value: string): boolean => {
  return value === value.toLocaleUpperCase(locale);
};

export default isUpperCase;
