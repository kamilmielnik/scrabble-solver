import { createSelector } from '@reduxjs/toolkit';

import { zipCharactersAndTiles } from 'lib';
import { selectRack, selectResultCandidateTiles } from 'state';

export const selectRemainingTilesGroups = createSelector(
  [selectRack, selectResultCandidateTiles],
  zipCharactersAndTiles,
);
