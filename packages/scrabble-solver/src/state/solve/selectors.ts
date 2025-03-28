import { createSelector } from '@reduxjs/toolkit';
import { isError } from '@scrabble-solver/types';

import type { RootState } from '../types';

export const selectSolve = (state: RootState) => state.solve;

export const selectSolveError = createSelector([selectSolve], (solve) => {
  return isError(solve.error) ? solve.error : undefined;
});

export const selectSolveIsLoading = createSelector([selectSolve], (solve) => solve.isLoading);

export const selectLastSolvedParameters = createSelector([selectSolve], (solve) => solve.lastSolvedParameters);
