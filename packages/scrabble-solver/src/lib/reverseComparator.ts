import { Comparator } from 'types';

const reverseComparator = <T>(comparator: Comparator<T>): Comparator<T> => (a: T, b: T): number => -comparator(a, b);

export default reverseComparator;
