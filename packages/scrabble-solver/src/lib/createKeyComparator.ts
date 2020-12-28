import { Comparator } from 'types';

import numberComparator from './numberComparator';
import stringComparator from './stringComparator';

const createKeyComparator = <T extends Record<keyof T, unknown>>(key: keyof T): Comparator<T> => {
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

export default createKeyComparator;
