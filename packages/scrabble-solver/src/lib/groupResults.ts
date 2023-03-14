import { Result } from '@scrabble-solver/types';

import { Point } from 'types';

import createRegExp from './createRegExp';

interface GroupedResults {
  matching: Result[];
  other: Result[];
}

const groupResults = (
  results: Result[] | undefined,
  query: string,
  cellFilter: Point[],
): GroupedResults | undefined => {
  if (typeof results === 'undefined') {
    return results;
  }

  return results.reduce<GroupedResults>(
    ({ matching, other }, result) => {
      const matchesQuery = createRegExp(query).test(result.word);
      const matchesCellFilter = cellFilter.every(({ x, y }) => {
        return result.cells.some((cell) => cell.x === x && cell.y === y);
      });
      const isMatching = matchesQuery && matchesCellFilter;

      return {
        matching: isMatching ? [...matching, result] : matching,
        other: isMatching ? other : [...other, result],
      };
    },
    { matching: [], other: [] },
  );
};

export default groupResults;
