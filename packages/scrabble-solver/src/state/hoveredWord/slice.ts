import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type BoardWord } from '@scrabble-solver/types';

import { hoveredWordInitialState } from './initialState';

export const hoveredWordSlice = createSlice({
  initialState: hoveredWordInitialState,
  name: 'hoveredWord',
  reducers: {
    set: (state, action: PayloadAction<BoardWord>) => {
      state.word = action.payload;
    },
    clear: (state) => {
      state.word = null;
    },
  },
});
