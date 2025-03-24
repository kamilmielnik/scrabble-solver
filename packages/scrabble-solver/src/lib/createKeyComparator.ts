import { Comparator } from 'types';

import { createStringComparator } from './createStringComparator';
import { numberComparator } from './numberComparator';

export const createKeyComparator = <T extends Record<keyof T, unknown>>(
  key: keyof T,
  locale: string,
): Comparator<T> => {
  const stringComparator = createStringComparator(locale);

  return (a: T, b: T): number => {
    const aValue = a[key];
    const bValue = b[key];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return stringComparator(aValue, bValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return numberComparator(aValue, bValue);
    }

    return 0;
  };
};
