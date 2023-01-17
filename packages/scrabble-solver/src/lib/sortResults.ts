import { Result } from '@scrabble-solver/types';

import { Comparator, ResultColumn, SortDirection } from 'types';

import createKeyComparator from './createKeyComparator';
import reverseComparator from './reverseComparator';

const comparators: Record<ResultColumn, (locale: string) => Comparator<Result>> = {
  [ResultColumn.BlanksCount]: (locale: string) => createKeyComparator('blanksCount', locale),
  [ResultColumn.ConsonantsCount]: (locale: string) => createKeyComparator('consonantsCount', locale),
  [ResultColumn.Points]: (locale: string) => createKeyComparator('points', locale),
  [ResultColumn.TilesCount]: (locale: string) => createKeyComparator('tilesCount', locale),
  [ResultColumn.VowelsCount]: (locale: string) => createKeyComparator('vowelsCount', locale),
  [ResultColumn.Word]: (locale: string) => createKeyComparator('word', locale),
  [ResultColumn.WordsCount]: (locale: string) => createKeyComparator('wordsCount', locale),
};

const sortResults = (
  results: Result[] | undefined,
  column: ResultColumn,
  sortDirection: SortDirection,
  locale: string,
): Result[] | undefined => {
  if (typeof results === 'undefined') {
    return results;
  }

  const createComparator = comparators[column];
  const comparator = createComparator(locale);
  const finalComparator = sortDirection === SortDirection.Descending ? reverseComparator(comparator) : comparator;
  return [...results].sort(finalComparator);
};

export default sortResults;
