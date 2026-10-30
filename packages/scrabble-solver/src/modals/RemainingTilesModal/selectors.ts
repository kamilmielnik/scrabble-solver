import { createSelector } from '@reduxjs/toolkit';

import { selectLocale, selectRemainingTiles } from '@/state';

import { getRemainingTilesGroups } from './lib';

export const selectRemainingTilesGroups = createSelector([selectRemainingTiles, selectLocale], getRemainingTilesGroups);
