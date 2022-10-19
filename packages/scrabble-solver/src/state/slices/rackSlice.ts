import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tile } from '@scrabble-solver/types';

import { createNullMovingComparator, inverseDirection, zipCharactersAndTiles } from 'lib';

import rackInitialState from './rackInitialState';

const rackSlice = createSlice({
  initialState: rackInitialState,
  name: 'rack',
  reducers: {
    change: (_state, action: PayloadAction<(string | null)[]>) => {
      const rack = action.payload;
      return rack;
    },

    changeCharacter: (state, action: PayloadAction<{ character: string | null; index: number }>) => {
      const { character, index } = action.payload;
      return [...state.slice(0, index), character, ...state.slice(index + 1)];
    },

    changeCharacters: (state, action: PayloadAction<{ characters: (string | null)[]; index: number }>) => {
      const { characters, index } = action.payload;
      const expectedRackLength = state.length;
      const rack = [...state.slice(0, index), ...characters, ...state.slice(index + characters.length)];
      return rack.slice(0, expectedRackLength);
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

    init: (_state, action: PayloadAction<(string | null)[]>) => {
      const rack = action.payload;
      return rack;
    },

    removeTiles: (state, action: PayloadAction<Tile[]>) => {
      const tilesToRemove = action.payload;
      const charactersAndTiles = zipCharactersAndTiles(state, tilesToRemove);
      const charactersWithoutMatchingTiles = charactersAndTiles.map(({ character, tile }) => (tile ? null : character));
      return charactersWithoutMatchingTiles;
    },

    reset: () => rackInitialState,
  },
});

export default rackSlice;
