import { createSelector } from 'reselect';

import { createKeyComparator, reverseComparator } from 'utils';

const pointsComparator = reverseComparator(createKeyComparator('points'));

export const selectRoot = (state) => state.results;
export const selectResults = createSelector(
  [selectRoot],
  (results) => [...results].sort(pointsComparator)
);
