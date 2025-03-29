import { createSelector } from '@reduxjs/toolkit';

import { createRegExp, sortResults } from 'lib';

import { selectCellFilters } from '../cellFilters';
import { selectLocale, selectShowCoordinates } from '../settings';
import type { RootState } from '../types';

import { groupResults, resultMatchesCellFilter } from './lib';

const selectResultIndex = (_: unknown, index: number): number => index;

export const selectResults = (state: RootState) => state.results;

export const selectResultCandidate = createSelector([selectResults], (results) => results.candidate);

export const selectResultsQuery = createSelector([selectResults], (results) => results.query);

const selectResultsResults = createSelector([selectResults], (results) => results.results);

export const selectResultsSort = createSelector([selectResults], (results) => results.sort);

export const selectResultCandidateCells = createSelector(
  [selectResultCandidate],
  (resultCandidate) => resultCandidate?.cells ?? [],
);

export const selectResultCandidateTiles = createSelector(
  [selectResultCandidate],
  (resultCandidate) => resultCandidate?.tiles ?? [],
);

const selectSortedResults = createSelector(
  [selectResultsResults, selectResultsSort, selectLocale, selectShowCoordinates],
  sortResults,
);

const selectGroupedSortedResults = createSelector(
  [selectSortedResults, selectResultsQuery, selectCellFilters],
  groupResults,
);

export const selectProcessedResults = createSelector([selectGroupedSortedResults], (results) => {
  return results ? [...results.matching, ...results.other] : undefined;
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
