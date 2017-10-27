import { createSelector } from 'reselect';
import { createKeyComparator, reverseComparator } from 'utils';

export const selectResults = (state) => state.results;
export const selectFilter = createSelector(selectResults, ({ filter }) => filter);
export const selectFilterRegexp = createSelector(selectFilter, (filter) => {
  try {
    return new RegExp(filter, 'i');
  } catch (error) {
    return /./;
  }
});
export const selectSortedColumnName = createSelector(selectResults, ({ sortedColumnName }) => sortedColumnName);
export const selectSortingDirection = createSelector(selectResults, ({ sortingDirection }) => sortingDirection);
export const selectResultsList = createSelector(selectResults, ({ results }) => results);
export const selectNumberOfResults = createSelector(selectResultsList, ({ length }) => length);
export const selectFilteredResults = createSelector(
  [ selectResultsList, selectFilterRegexp ],
  (results, regexp) => results.filter(({ word }) => regexp.test(word))
);
export const selectNumberOfFilteredResults = createSelector(selectFilteredResults, ({ length }) => length);
export const selectSortedResults = createSelector(
  [ selectFilteredResults, selectSortedColumnName, selectSortingDirection ],
  (results, sortedColumnName, sortingDirection) => {
    let comparator = createKeyComparator(sortedColumnName);
    if (sortingDirection === 'descending') {
      comparator = reverseComparator(comparator);
    }
    return [ ...results ].sort(comparator);
  }
);
export const selectFormattedResults = createSelector(
  [ selectSortedResults ],
  (results) => results.map(({ pointsRatio, ...result }) => ({
    ...result,
    pointsRatio: pointsRatio.toFixed(2)
  }))
);
