import { Comparator } from 'types';

import createStringComparator from './createStringComparator';
import numberComparator from './numberComparator';

const createComparator = <T>(locale: string): Comparator<T> => {
  const stringComparator = createStringComparator(locale);

  return (a: T, b: T): number => {
    if (typeof a === 'string' && typeof b === 'string') {
      return stringComparator(a, b);
    }

    if (typeof a === 'number' && typeof b === 'number') {
      return numberComparator(a, b);
    }

    return 0;
  };
};

export default createComparator;
