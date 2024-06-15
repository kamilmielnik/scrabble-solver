import { Result } from '@scrabble-solver/types';

import { CellFilterEntry } from 'types';

const resultMatchesCellFilter = (result: Result, cellFilter: CellFilterEntry[]) => {
  const excludeFilters = cellFilter.filter((filter) => filter.type === 'exclude');
  const matchesExcludeFilters = excludeFilters.every(({ x, y }) => {
    return result.cells.every((cell) => cell.x !== x || cell.y !== y);
  });

  if (!matchesExcludeFilters) {
    return false;
  }

  const includeFilter = cellFilter.filter((filter) => filter.type === 'include');
  const matchesIncludeFilters = includeFilter.every(({ x, y }) => {
    return result.cells.some((cell) => cell.x === x && cell.y === y);
  });

  return matchesExcludeFilters && matchesIncludeFilters;
};

export default resultMatchesCellFilter;
