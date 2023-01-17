import { Comparator } from 'types';

const createStringComparator: (locale: string) => Comparator<string> = (locale) => (a, b) => a.localeCompare(b, locale);

export default createStringComparator;
