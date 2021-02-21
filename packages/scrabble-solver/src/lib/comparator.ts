import numberComparator from './numberComparator';
import stringComparator from './stringComparator';

const comparator = <T>(a: T, b: T): number => {
  if (typeof a === 'string' && typeof b === 'string') {
    return stringComparator(a, b);
  }

  if (typeof a === 'number' && typeof b === 'number') {
    return numberComparator(a, b);
  }

  return 0;
};

export default comparator;
