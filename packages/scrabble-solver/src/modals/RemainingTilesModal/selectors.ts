import { createSelector } from '@reduxjs/toolkit';

import { selectRemainingTiles } from 'state';

import { getRemainingTilesGroups } from './lib';

export const selectRemainingTilesGroups = createSelector([selectRemainingTiles], getRemainingTilesGroups);
