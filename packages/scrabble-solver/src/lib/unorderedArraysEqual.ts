import comparator from './comparator';

const unorderedArraysEqual = <T>(a: T[], b: T[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  const aSorted = [...a].sort(comparator);
  const bSorted = [...b].sort(comparator);
  return aSorted.every((character, index) => character === bSorted[index]);
};

export default unorderedArraysEqual;
