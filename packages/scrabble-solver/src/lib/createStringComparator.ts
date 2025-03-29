import { type Comparator } from 'types';

export const createStringComparator: (locale: string) => Comparator<string> = (locale) => {
  return (a, b) => {
    return a.localeCompare(b, locale);
  };
};
