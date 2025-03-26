import { createSelector } from '@reduxjs/toolkit';

import { createRegExp, groupResults, resultMatchesCellFilter, sortResults } from 'lib';

import { selectCellFilters, selectResults } from './root';
import { selectLocale, selectShowCoordinates } from './settings';

const selectResultIndex = (_: unknown, index: number): number => index;

export const selectResultCandidate = createSelector([selectResults], (results) => results.candidate);

export const selectResultsQuery = createSelector([selectResults], (results) => results.query);

export const selectResultsRaw = createSelector([selectResults], (results) => results.results);

export const selectResultsSort = createSelector([selectResults], (results) => results.sort);

const selectSortedResults = createSelector(
  [selectResultsRaw, selectResultsSort, selectLocale, selectShowCoordinates],
  sortResults,
);

const selectGroupedSortedResults = createSelector(
  [selectSortedResults, selectResultsQuery, selectCellFilters],
  groupResults,
);

export const selectProcessedResults = createSelector([selectGroupedSortedResults], (groupedResults) => {
  if (!groupedResults) {
    return undefined;
  }

  return [...groupedResults.matching, ...groupedResults.other];
});

export const selectIsResultMatching = createSelector(
  [selectProcessedResults, selectResultsQuery, selectCellFilters, selectResultIndex],
  (results, query, cellFilters, index) => {
    if (!results) {
      return false;
    }

    const result = results[index];
    const regExp = createRegExp(query);

    if (!regExp.test(result.word)) {
      return false;
    }

    return resultMatchesCellFilter(result, cellFilters);
  },
);

export const selectResultCandidateCells = createSelector(
  [selectResultCandidate],
  (resultCandidate) => resultCandidate?.cells ?? [],
);

export const selectResultCandidateTiles = createSelector(
  [selectResultCandidate],
  (resultCandidate) => resultCandidate?.tiles ?? [],
);
