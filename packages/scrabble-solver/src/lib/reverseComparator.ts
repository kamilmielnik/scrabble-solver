import { Comparator } from 'types';

export const reverseComparator = <T>(comparator: Comparator<T>): Comparator<T> => {
  return (a: T, b: T): number => -comparator(a, b);
};
