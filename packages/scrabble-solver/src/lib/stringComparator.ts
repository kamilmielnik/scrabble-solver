import { Comparator } from 'types';

const stringComparator: Comparator<string> = (a, b) => a.localeCompare(b);

export default stringComparator;
