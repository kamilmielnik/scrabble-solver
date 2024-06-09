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

  const regExp = createRegExp(query);

  return results.reduce<GroupedResults>(
    (groupedResults, result) => {
      const matchesQuery = () => regExp.test(result.word);
      const matchesCellFilter = () =>
        cellFilter.every(({ x, y }) => {
          return result.cells.some((cell) => cell.x === x && cell.y === y);
        });

      if (matchesCellFilter() && matchesQuery()) {
        groupedResults.matching.push(result);
      } else {
        groupedResults.other.push(result);
      }

      return groupedResults;
    },
    { matching: [], other: [] },
  );
};

export default groupResults;
