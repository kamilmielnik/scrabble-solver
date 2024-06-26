import { Result } from '@scrabble-solver/types';

import { CellFilterEntry, Sort } from 'types';

import createRegExp from './createRegExp';
import resultMatchesCellFilter from './resultMatchesCellFilter';
import sortResults from './sortResults';

interface GroupedResults {
  matching: Result[];
  other: Result[];
}

const groupResults = (
  results: Result[] | undefined,
  sort: Sort,
  locale: string,
  query: string,
  cellFilter: CellFilterEntry[],
): GroupedResults | undefined => {
  if (typeof results === 'undefined') {
    return results;
  }

  const regExp = createRegExp(query);

  const { matching, other } = results.reduce<GroupedResults>(
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

  return {
    matching: sortResults(matching, sort, locale) ?? [],
    other: sortResults(other, sort, locale) ?? [],
  };
};

export default groupResults;
