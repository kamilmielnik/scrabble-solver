export const noop = () => undefined;
export const reverseComparator = (comparator) => (a, b) => -comparator(a, b);
export const createKeyComparator = (key) => (a, b) => {
  const aValue = a[key];
  const bValue = b[key];
  const compare = typeof aValue === 'string' ? stringsComparator : numbersComparator;
  return compare(aValue, bValue);
};
const stringsComparator = (a, b) => a.localeCompare(b);
const numbersComparator = (a, b) => {
  if (a < b) {
    return -1;
  }

  if (a > b) {
    return 1;
  }

  return 0;
};
