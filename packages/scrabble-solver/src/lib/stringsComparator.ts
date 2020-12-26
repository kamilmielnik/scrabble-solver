import { Comparator } from 'types';

const stringsComparator: Comparator<string> = (a, b) => a.localeCompare(b);

export default stringsComparator;
