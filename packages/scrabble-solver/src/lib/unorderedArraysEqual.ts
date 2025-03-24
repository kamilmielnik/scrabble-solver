import { createComparator } from './createComparator';

export const unorderedArraysEqual = <T>(a: T[], b: T[], locale: string): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  const comparator = createComparator(locale);
  const aSorted = [...a].sort(comparator);
  const bSorted = [...b].sort(comparator);
  return aSorted.every((character, index) => character === bSorted[index]);
};
