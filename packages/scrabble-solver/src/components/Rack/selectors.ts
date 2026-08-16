import { createSelector } from '@reduxjs/toolkit';

import { zipCharactersAndTiles } from '@/lib/zipCharactersAndTiles';
import { selectRack, selectResultCandidateTiles } from '@/state';

export const selectRemainingTilesGroups = createSelector(
  [selectRack, selectResultCandidateTiles],
  zipCharactersAndTiles,
);
