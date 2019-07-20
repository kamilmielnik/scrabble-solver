import { createSelector } from 'reselect';

import { createKeyComparator, reverseComparator } from 'utils';

export const selectResults = (state) => state.results;
export const selectSortedColumnName = createSelector(
  selectResults,
  ({ sortedColumnName }) => sortedColumnName
);
export const selectSortingDirection = createSelector(
  selectResults,
  ({ sortingDirection }) => sortingDirection
);
export const selectResultsList = createSelector(
  selectResults,
  ({ results }) => results
);
export const selectNumberOfResults = createSelector(
  selectResultsList,
  ({ length }) => length
);
export const selectSortedResults = createSelector(
  [selectResultsList, selectSortedColumnName, selectSortingDirection],
  (results, sortedColumnName, sortingDirection) => {
    let comparator = createKeyComparator(sortedColumnName);
    if (sortingDirection === 'descending') {
      comparator = reverseComparator(comparator);
    }
    return [...results].sort(comparator);
  }
);
export const selectFormattedResults = createSelector(
  [selectSortedResults],
  (results) =>
    results.map(({ pointsRatio, ...result }) => ({
      ...result,
      pointsRatio: pointsRatio.toFixed(2)
    }))
);
