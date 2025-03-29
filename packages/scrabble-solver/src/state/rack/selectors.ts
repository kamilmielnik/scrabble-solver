import { createSelector } from '@reduxjs/toolkit';

import { type RootState } from '../types';

export const selectRack = (state: RootState) => state.rack;

export const selectCharacters = createSelector(selectRack, (rack) => rack.filter((tile) => tile !== null));
