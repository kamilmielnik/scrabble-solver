import { Result } from '@scrabble-solver/types';

import { Comparator, ResultColumn, SortDirection } from 'types';

import createKeyComparator from './createKeyComparator';
import reverseComparator from './reverseComparator';

const comparators: Record<ResultColumn, Comparator<Result>> = {
  [ResultColumn.BlanksCount]: createKeyComparator('numberOfBlanks'),
  [ResultColumn.ConsonantsCount]: createKeyComparator('numberOfConsonants'),
  [ResultColumn.Points]: createKeyComparator('points'),
  [ResultColumn.TilesCount]: createKeyComparator('numberOfTiles'),
  [ResultColumn.VowelsCount]: createKeyComparator('numberOfVowels'),
  [ResultColumn.Word]: createKeyComparator('word'),
  [ResultColumn.WordsCount]: createKeyComparator('numberOfWords'),
};

const sortResults = (
  results: Result[] | undefined,
  column: ResultColumn,
  sortDirection: SortDirection,
): Result[] | undefined => {
  if (typeof results === 'undefined') {
    return results;
  }

  const comparator = comparators[column];
  const finalComparator = sortDirection === SortDirection.Descending ? reverseComparator(comparator) : comparator;
  return [...results].sort(finalComparator);
};

export default sortResults;
