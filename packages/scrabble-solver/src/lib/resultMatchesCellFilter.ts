import { Result } from '@scrabble-solver/types';

import { CellFilter } from 'types';

export const resultMatchesCellFilter = (result: Result, cellFilters: CellFilter[]) => {
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
