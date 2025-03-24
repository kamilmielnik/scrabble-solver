import { Result, ShowCoordinates } from '@scrabble-solver/types';

import { Comparator, ResultColumnId, Sort, SortDirection } from 'types';

import { createKeyComparator } from './createKeyComparator';
import { createStringComparator } from './createStringComparator';
import { getCoordinates } from './getCoordinates';
import { reverseComparator } from './reverseComparator';

const comparators: Record<ResultColumnId, (locale: string, showCoordinates: ShowCoordinates) => Comparator<Result>> = {
  [ResultColumnId.BlanksCount]: (locale: string) => createKeyComparator('blanksCount', locale),
  [ResultColumnId.ConsonantsCount]: (locale: string) => createKeyComparator('consonantsCount', locale),
  [ResultColumnId.Coordinates]: (locale: string, showCoordinates: ShowCoordinates) => (a, b) => {
    const stringComparator = createStringComparator(locale);
    const aValue = getCoordinates(a, showCoordinates);
    const bValue = getCoordinates(b, showCoordinates);
    return stringComparator(aValue, bValue);
  },
  [ResultColumnId.Points]: (locale: string) => createKeyComparator('points', locale),
  [ResultColumnId.TilesCount]: (locale: string) => createKeyComparator('tilesCount', locale),
  [ResultColumnId.VowelsCount]: (locale: string) => createKeyComparator('vowelsCount', locale),
  [ResultColumnId.Word]: (locale: string) => createKeyComparator('word', locale),
  [ResultColumnId.WordsCount]: (locale: string) => createKeyComparator('wordsCount', locale),
};

export const sortResults = (
  results: Result[] | undefined,
  sort: Sort,
  locale: string,
  showCoordinates: ShowCoordinates,
): Result[] | undefined => {
  if (typeof results === 'undefined') {
    return results;
  }

  const createComparator = comparators[sort.column];
  const comparator = createComparator(locale, showCoordinates);
  const finalComparator = sort.direction === SortDirection.Descending ? reverseComparator(comparator) : comparator;
  const sortedResults = [...results].sort(finalComparator);
  return sortedResults;
};
