import { createSelector } from 'reselect';

export const selectRoot = (state) => state.shared;
export const selectIsLoading = createSelector(
  selectRoot,
  ({ isLoading }) => isLoading
);
