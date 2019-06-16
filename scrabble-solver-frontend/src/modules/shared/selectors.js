import { createSelector } from 'reselect';

export const selectRoot = (state) => state.shared;
export const selectIsLoading = createSelector(
  selectRoot,
  ({ isLoading }) => isLoading
);
export const selectResultCandidate = createSelector(
  selectRoot,
  ({ resultCandidate }) => resultCandidate
);
