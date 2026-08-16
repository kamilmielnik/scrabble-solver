import { type BoardWord, type ShowCoordinates } from '@scrabble-solver/types';

import { createKeyComparator } from '@/lib/createKeyComparator';
import { createStringComparator } from '@/lib/createStringComparator';
import { getCoordinates } from '@/lib/getCoordinates';
import { numberComparator } from '@/lib/numberComparator';
import { reverseComparator } from '@/lib/reverseComparator';
import { type Comparator, type Sort, SortDirection, WordColumnId } from '@/types';

export const getWordCoordinates = (word: BoardWord, showCoordinates: ShowCoordinates): string => {
  return getCoordinates({ isHorizontal: word.direction === 'horizontal', x: word.x, y: word.y }, showCoordinates);
};

const comparators: Record<WordColumnId, (locale: string, showCoordinates: ShowCoordinates) => Comparator<BoardWord>> = {
  [WordColumnId.Coordinates]: (locale: string, showCoordinates: ShowCoordinates) => (a, b) => {
    const stringComparator = createStringComparator(locale);
    const aValue = getWordCoordinates(a, showCoordinates);
    const bValue = getWordCoordinates(b, showCoordinates);
    return stringComparator(aValue, bValue);
  },
  [WordColumnId.Validity]: () => (a, b) => {
    return numberComparator(Number(a.isValid ?? false), Number(b.isValid ?? false));
  },
  [WordColumnId.Word]: (locale: string) => createKeyComparator('word', locale),
};

export const sortWords = (
  words: BoardWord[],
  sort: Sort<WordColumnId>,
  locale: string,
  showCoordinates: ShowCoordinates,
): BoardWord[] => {
  const createComparator = comparators[sort.column];
  const comparator = createComparator(locale, showCoordinates);
  const finalComparator = sort.direction === SortDirection.Descending ? reverseComparator(comparator) : comparator;
  return [...words].sort(finalComparator);
};
