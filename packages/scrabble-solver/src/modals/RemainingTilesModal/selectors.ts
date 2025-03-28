import { createSelector } from '@reduxjs/toolkit';

import { getRemainingTilesGroups } from 'lib';
import { selectRemainingTiles } from 'state';

export const selectRemainingTilesGroups = createSelector([selectRemainingTiles], getRemainingTilesGroups);
