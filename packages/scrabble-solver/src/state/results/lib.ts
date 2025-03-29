import { Result } from '@scrabble-solver/types';

import { createRegExp } from 'lib';
import { CellFilter, GroupedResults } from 'types';

export const groupResults = (
  results: Result[] | undefined,
  query: string,
  cellFilters: CellFilter[],
): GroupedResults | undefined => {
  if (typeof results === 'undefined') {
    return undefined;
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

export const resultMatchesCellFilter = (result: Result, cellFilters: CellFilter[]): boolean => {
  const excludeFilters = cellFilters.filter((filter) => filter.type === 'exclude');
  const matchesExcludeFilters = excludeFilters.every(({ x, y }) => {
    return result.cells.every((cell) => cell.x !== x || cell.y !== y);
  });

  if (!matchesExcludeFilters) {
    return false;
  }

  const includeFilter = cellFilters.filter((filter) => filter.type === 'include');
  const matchesIncludeFilters = includeFilter.every(({ x, y }) => {
    return result.cells.some((cell) => cell.x === x && cell.y === y);
  });

  return matchesExcludeFilters && matchesIncludeFilters;
};
