import { Locale, ShowCoordinates } from '@scrabble-solver/types';

import { GroupedResults, Sort } from 'types';

import { sortResults } from './sortResults';

export const sortGroupedResults = (
  results: GroupedResults | undefined,
  sort: Sort,
  locale: Locale,
  showCoordinates: ShowCoordinates,
): GroupedResults | undefined => {
  if (typeof results === 'undefined') {
    return results;
  }

  return {
    matching: sortResults(results.matching, sort, locale, showCoordinates) ?? [],
    other: sortResults(results.other, sort, locale, showCoordinates) ?? [],
  };
};
