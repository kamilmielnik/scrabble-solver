import { createSelector } from '@reduxjs/toolkit';

import { selectRack } from './root';

export const selectCharacters = createSelector(selectRack, (rack) => rack.filter((tile) => tile !== null));
