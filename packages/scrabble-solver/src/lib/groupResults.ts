import { Result } from '@scrabble-solver/types';

import { CellFilterEntry } from 'types';

import createRegExp from './createRegExp';
import resultMatchesCellFilter from './resultMatchesCellFilter';

interface GroupedResults {
  matching: Result[];
  other: Result[];
}

const groupResults = (
  results: Result[] | undefined,
  query: string,
  cellFilter: CellFilterEntry[],
): GroupedResults | undefined => {
  if (typeof results === 'undefined') {
    return results;
  }

  const regExp = createRegExp(query);

  return results.reduce<GroupedResults>(
    (groupedResults, result) => {
      const matchesQuery = () => regExp.test(result.word);

      if (resultMatchesCellFilter(result, cellFilter) && matchesQuery()) {
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
