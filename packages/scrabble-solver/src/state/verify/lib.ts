import { type BoardWord, type ShowCoordinates } from '@scrabble-solver/types';

import { createKeyComparator } from '@/lib/createKeyComparator';
import { createRegExp } from '@/lib/createRegExp';
import { createStringComparator } from '@/lib/createStringComparator';
import { getCoordinates } from '@/lib/getCoordinates';
import { numberComparator } from '@/lib/numberComparator';
import { reverseComparator } from '@/lib/reverseComparator';
import { type Comparator, type GroupedWords, type Sort, SortDirection, type VerifiedWord, WordColumnId } from '@/types';

export const getWordCoordinates = (word: BoardWord, showCoordinates: ShowCoordinates): string => {
  return getCoordinates({ isHorizontal: word.direction === 'horizontal', x: word.x, y: word.y }, showCoordinates);
};

export const groupWords = (words: VerifiedWord[], query: string): GroupedWords => {
  const regExp = createRegExp(query);

  return words.reduce<GroupedWords>(
    (groupedWords, word) => {
      if (word.word.match(regExp)) {
        groupedWords.matching.push(word);
      } else {
        groupedWords.other.push(word);
      }

      return groupedWords;
    },
    { matching: [], other: [] },
  );
};

const comparators: Record<
  WordColumnId,
  (locale: string, showCoordinates: ShowCoordinates) => Comparator<VerifiedWord>
> = {
  [WordColumnId.Coordinates]: (locale: string, showCoordinates: ShowCoordinates) => (a, b) => {
    const stringComparator = createStringComparator(locale);
    const aValue = getWordCoordinates(a, showCoordinates);
    const bValue = getWordCoordinates(b, showCoordinates);
    return stringComparator(aValue, bValue);
  },
  [WordColumnId.Validity]: () => (a, b) => {
    return numberComparator(Number(a.isValid), Number(b.isValid));
  },
  [WordColumnId.Word]: (locale: string) => createKeyComparator('word', locale),
};

export const sortWords = (
  words: VerifiedWord[],
  sort: Sort<WordColumnId>,
  locale: string,
  showCoordinates: ShowCoordinates,
): VerifiedWord[] => {
  const createComparator = comparators[sort.column];
  const comparator = createComparator(locale, showCoordinates);
  const finalComparator = sort.direction === SortDirection.Descending ? reverseComparator(comparator) : comparator;
  return [...words].sort(finalComparator);
};
