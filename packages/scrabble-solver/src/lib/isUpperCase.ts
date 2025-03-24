import { Locale } from '@scrabble-solver/types';

export const isUpperCase = (locale: Locale, value: string): boolean => {
  return value === value.toLocaleUpperCase(locale);
};
