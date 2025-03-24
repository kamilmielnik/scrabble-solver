import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tile } from '@scrabble-solver/types';

import { arrayEquals, createNullMovingComparator, inverseDirection, zipCharactersAndTiles } from 'lib';
import { AutoGroupTiles, Rack } from 'types';

import { rackInitialState, rackDefaultState } from './rackInitialState';

export const rackSlice = createSlice({
  initialState: rackInitialState,
  name: 'rack',
  reducers: {
    changeCharacter: (state, action: PayloadAction<{ character: string | null; index: number }>) => {
      const { character, index } = action.payload;
      return [...state.slice(0, index), character, ...state.slice(index + 1)];
    },

    changeCharacters: (state, action: PayloadAction<{ characters: Rack; index: number }>) => {
      const { characters, index } = action.payload;

      if (characters.length === 0) {
        return state;
      }

      const expectedRackLength = state.length;
      const rack = [...state.slice(0, index), ...characters, ...state.slice(index + characters.length)];
      return rack.slice(0, expectedRackLength);
    },

    groupTiles: (state, action: PayloadAction<AutoGroupTiles>) => {
      if (action.payload === null) {
        return state;
      }

      const nullMovingComparator = createNullMovingComparator(inverseDirection(action.payload));
      const sortedTiles = [...state].sort(nullMovingComparator);
      return arrayEquals(state, sortedTiles) ? state : sortedTiles;
    },

    init: (state, action: PayloadAction<Rack>) => {
      return arrayEquals(state, action.payload) ? state : action.payload;
    },

    removeTiles: (state, action: PayloadAction<Tile[]>) => {
      const tilesToRemove = action.payload;
      const charactersAndTiles = zipCharactersAndTiles(state, tilesToRemove);
      const charactersWithoutMatchingTiles = charactersAndTiles.map(({ character, tile }) => (tile ? null : character));
      return charactersWithoutMatchingTiles;
    },

    reset: () => rackDefaultState,
  },
});
