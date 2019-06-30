import { createSelector } from 'reselect';
import { BLANK } from '@scrabble-solver/constants';
import { Tile } from '@scrabble-solver/models';
import { selectConfig } from 'config/selectors';

export const selectTiles = (state) => state.tiles;
export const selectInput = createSelector(
  selectTiles,
  ({ input }) => input
);
export const selectInputLength = createSelector(
  selectInput,
  (input) => input.length
);
export const selectInputMaxLength = createSelector(
  selectConfig,
  ({ maximumNumberOfCharacters }) => maximumNumberOfCharacters
);
export const selectInputTiles = createSelector(
  selectInput,
  (input) =>
    input.split('').map(
      (character) =>
        new Tile({
          character,
          isBlank: character === BLANK
        })
    )
);
