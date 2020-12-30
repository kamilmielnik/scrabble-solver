import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tile } from '@scrabble-solver/models';

import { zipCharactersAndTiles } from 'lib';

import tilesInitialState from './tilesInitialState';

const tiles = createSlice({
  initialState: tilesInitialState,
  name: 'tiles',
  reducers: {
    changeCharacter: (state, action: PayloadAction<{ character: string | null; index: number }>) => {
      const { character, index } = action.payload;
      return [...state.slice(0, index), character, ...state.slice(index + 1)];
    },

    removeTiles: (state, action: PayloadAction<Tile[]>) => {
      const tilesToRemove = action.payload;
      const charactersAndTiles = zipCharactersAndTiles(state, tilesToRemove);
      const charactersWithoutMatchingTiles = charactersAndTiles.map(({ character, tile }) => (tile ? null : character));
      return charactersWithoutMatchingTiles;
    },
  },
});

export default tiles;
