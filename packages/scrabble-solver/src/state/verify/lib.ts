import { type BoardWord, type ShowCoordinates } from '@scrabble-solver/types';

import { createCoordinatesComparator } from '@/lib/createCoordinatesComparator';
import { createKeyComparator } from '@/lib/createKeyComparator';
import { createRegExp } from '@/lib/createRegExp';
import { createSortComparator } from '@/lib/createSortComparator';
import { getCoordinates } from '@/lib/getCoordinates';
import { numberComparator } from '@/lib/numberComparator';
import { type ComparatorFactory, type GroupedWords, type Sort, type VerifiedWord, WordColumnId } from '@/types';

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

const comparators: Record<WordColumnId, ComparatorFactory<VerifiedWord>> = {
  [WordColumnId.Coordinates]: (locale: string, showCoordinates: ShowCoordinates) => {
    return createCoordinatesComparator({ getItemCoordinates: getWordCoordinates, locale, showCoordinates });
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
  return [...words].sort(createSortComparator({ comparators, locale, showCoordinates, sort }));
};
