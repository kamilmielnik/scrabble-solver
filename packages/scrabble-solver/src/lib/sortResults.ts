import { Result } from '@scrabble-solver/types';

import { Comparator, ResultColumn, SortDirection } from 'types';

import createKeyComparator from './createKeyComparator';
import reverseComparator from './reverseComparator';

const comparators: Record<ResultColumn, Comparator<Result>> = {
  [ResultColumn.BlanksCount]: createKeyComparator('blanksCount'),
  [ResultColumn.ConsonantsCount]: createKeyComparator('consonantsCount'),
  [ResultColumn.Points]: createKeyComparator('points'),
  [ResultColumn.TilesCount]: createKeyComparator('tilesCount'),
  [ResultColumn.VowelsCount]: createKeyComparator('vowelsCount'),
  [ResultColumn.Word]: createKeyComparator('word'),
  [ResultColumn.WordsCount]: createKeyComparator('wordsCount'),
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
