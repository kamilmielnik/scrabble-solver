import { createSelector } from 'reselect';

export const selectCharacters = (state) => state.tiles;
export const selectValidCharacters = createSelector(
  selectCharacters,
  (tiles) => tiles.filter((tile) => tile !== null)
);
