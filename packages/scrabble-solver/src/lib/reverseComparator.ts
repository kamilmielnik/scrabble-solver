import { Comparator } from 'types';

const reverseComparator = <T>(comparator: Comparator<T>): Comparator<T> => {
  return (a: T, b: T): number => -comparator(a, b);
};

export default reverseComparator;
