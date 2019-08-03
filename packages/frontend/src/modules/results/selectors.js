import { createSelector } from 'reselect';

import { createKeyComparator, reverseComparator } from 'utils';

const pointsComparator = reverseComparator(createKeyComparator('points'));

const selectRoot = (state) => state.results;

export const selectResults = createSelector(
  [selectRoot],
  ({ results }) => [...results].sort(pointsComparator)
);

export const selectResultCandidate = createSelector(
  [selectRoot],
  ({ candidate }) => candidate
);
