import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BLANK } from '@scrabble-solver/constants';
import { Tile } from '@scrabble-solver/models';

import tilesInitialState from './tilesInitialState';

const tiles = createSlice({
  initialState: tilesInitialState,
  name: 'tiles',
  reducers: {
    changeCharacter: (state, action: PayloadAction<{ character: string; index: number }>) => {
      const { character, index } = action.payload;
      return [...state.slice(0, index), character, ...state.slice(index + 1)];
    },

    removeTiles: (state, action: PayloadAction<Tile[]>) => {
      const tiles = action.payload;
      const result: (string | null)[] = [];
      let remainingTiles = RemainingTiles(tiles);

      state.forEach((character) => {
        const matchingTile = character && remainingTiles.find(character);

        if (matchingTile) {
          remainingTiles.remove(matchingTile);
          result.push(null);
        } else {
          result.push(character);
        }
      });

      return result;
    },
  },
});

const RemainingTiles = (initialTiles: Tile[]) => {
  let tiles = [...initialTiles];

  return {
    find: (character: string): Tile | undefined => {
      return tiles.find((tile) => {
        if (character === BLANK) {
          return tile.isBlank;
        }

        return character === tile.character;
      });
    },

    remove(tile: Tile) {
      const index = tiles.indexOf(tile);

      if (index >= 0) {
        tiles = [...tiles.slice(0, index), ...tiles.slice(index + 1)];
      }
    },
  };
};

export default tiles;
