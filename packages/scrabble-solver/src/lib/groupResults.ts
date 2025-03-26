import { Result } from '@scrabble-solver/types';

import { CellFilter, GroupedResults } from 'types';

import { createRegExp } from './createRegExp';
import { resultMatchesCellFilter } from './resultMatchesCellFilter';

export const groupResults = (
  results: Result[] | undefined,
  query: string,
  cellFilters: CellFilter[],
): GroupedResults | undefined => {
  if (typeof results === 'undefined') {
    return results;
  }

  const regExp = createRegExp(query);

  const { matching, other } = results.reduce<GroupedResults>(
    (groupedResults, result) => {
      const matchesQuery = () => Boolean(result.word.match(regExp));

      if (resultMatchesCellFilter(result, cellFilters) && matchesQuery()) {
        groupedResults.matching.push(result);
      } else {
        groupedResults.other.push(result);
      }

      return groupedResults;
    },
    { matching: [], other: [] },
  );

  return { matching, other };
};
