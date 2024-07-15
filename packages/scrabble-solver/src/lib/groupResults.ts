import { Result } from '@scrabble-solver/types';

import { CellFilterEntry, GroupedResults } from 'types';

import createRegExp from './createRegExp';
import resultMatchesCellFilter from './resultMatchesCellFilter';

const groupResults = (
  results: Result[] | undefined,
  query: string,
  cellFilter: CellFilterEntry[],
): GroupedResults | undefined => {
  if (typeof results === 'undefined') {
    return results;
  }

  const regExp = createRegExp(query);

  const { matching, other } = results.reduce<GroupedResults>(
    (groupedResults, result) => {
      const matchesQuery = () => Boolean(result.word.match(regExp));

      if (resultMatchesCellFilter(result, cellFilter) && matchesQuery()) {
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

export default groupResults;
