import { Locale } from '@scrabble-solver/types';

import { GroupedResults, Sort } from 'types';

import sortResults from './sortResults';

const sortGroupedResults = (
  results: GroupedResults | undefined,
  sort: Sort,
  locale: Locale,
): GroupedResults | undefined => {
  if (typeof results === 'undefined') {
    return results;
  }

  return {
    matching: sortResults(results.matching, sort, locale) ?? [],
    other: sortResults(results.other, sort, locale) ?? [],
  };
};

export default sortGroupedResults;
