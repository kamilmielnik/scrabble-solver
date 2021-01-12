import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tile } from '@scrabble-solver/models';

import { createNullMovingComparator, zipCharactersAndTiles } from 'lib';

import tilesInitialState from './tilesInitialState';

const inverseDirection = (direction: 'left' | 'right'): 'left' | 'right' => {
  return direction === 'left' ? 'right' : 'left';
};

const tilesSlice = createSlice({
  initialState: tilesInitialState,
  name: 'tiles',
  reducers: {
    change: (_state, action: PayloadAction<(string | null)[]>) => {
      const tiles = action.payload;
      return tiles;
    },

    changeCharacter: (state, action: PayloadAction<{ character: string | null; index: number }>) => {
      const { character, index } = action.payload;
      return [...state.slice(0, index), character, ...state.slice(index + 1)];
    },

    groupTiles: (state, action: PayloadAction<'left' | 'right' | null>) => {
      const direction = action.payload;

      if (direction === null) {
        return state;
      }

      const nullMovingComparator = createNullMovingComparator(inverseDirection(direction));
      const sortedTiles = [...state].sort(nullMovingComparator);
      return sortedTiles;
    },

    removeTiles: (state, action: PayloadAction<Tile[]>) => {
      const tilesToRemove = action.payload;
      const charactersAndTiles = zipCharactersAndTiles(state, tilesToRemove);
      const charactersWithoutMatchingTiles = charactersAndTiles.map(({ character, tile }) => (tile ? null : character));
      return charactersWithoutMatchingTiles;
    },

    reset: () => tilesInitialState,
  },
});

export default tilesSlice;
