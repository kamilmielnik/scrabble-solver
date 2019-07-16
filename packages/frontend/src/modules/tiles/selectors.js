import { createSelector } from 'reselect';

export const selectTiles = (state) => state.tiles;
export const selectValidTiles = createSelector(
  selectTiles,
  (tiles) => tiles.filter((tile) => tile !== null)
);
