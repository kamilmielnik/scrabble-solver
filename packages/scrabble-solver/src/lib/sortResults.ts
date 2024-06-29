import { Result, ShowCoordinates } from '@scrabble-solver/types';

import { Comparator, ResultColumn, Sort, SortDirection } from 'types';

import createKeyComparator from './createKeyComparator';
import createStringComparator from './createStringComparator';
import getCoordinates from './getCoordinates';
import reverseComparator from './reverseComparator';

const comparators: Record<ResultColumn, (locale: string, showCoordinates: ShowCoordinates) => Comparator<Result>> = {
  [ResultColumn.BlanksCount]: (locale: string) => createKeyComparator('blanksCount', locale),
  [ResultColumn.ConsonantsCount]: (locale: string) => createKeyComparator('consonantsCount', locale),
  [ResultColumn.Coordinates]: (locale: string, showCoordinates: ShowCoordinates) => (a, b) => {
    const stringComparator = createStringComparator(locale);
    const aValue = getCoordinates(a, showCoordinates);
    const bValue = getCoordinates(b, showCoordinates);
    return stringComparator(aValue, bValue);
  },
  [ResultColumn.Points]: (locale: string) => createKeyComparator('points', locale),
  [ResultColumn.TilesCount]: (locale: string) => createKeyComparator('tilesCount', locale),
  [ResultColumn.VowelsCount]: (locale: string) => createKeyComparator('vowelsCount', locale),
  [ResultColumn.Word]: (locale: string) => createKeyComparator('word', locale),
  [ResultColumn.WordsCount]: (locale: string) => createKeyComparator('wordsCount', locale),
};

const sortResults = (
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

export default sortResults;
