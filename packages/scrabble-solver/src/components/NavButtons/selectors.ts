import { createSelector } from '@reduxjs/toolkit';

import { selectInvalidWords, selectRemainingTiles } from 'state';

export const selectHasInvalidWords = createSelector([selectInvalidWords], (invalidWords) => {
  return invalidWords.length > 0;
});

export const selectHasOverusedTiles = createSelector([selectRemainingTiles], (remainingTiles) => {
  return remainingTiles.some(({ count = 0, usedCount }) => usedCount > count);
});
