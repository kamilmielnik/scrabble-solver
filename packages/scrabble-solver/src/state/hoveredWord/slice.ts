import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type VerifiedWord } from '@/types';

import { hoveredWordInitialState } from './initialState';

export const hoveredWordSlice = createSlice({
  initialState: hoveredWordInitialState,
  name: 'hoveredWord',
  reducers: {
    set: (state, action: PayloadAction<VerifiedWord>) => {
      state.word = action.payload;
    },
    clear: (state) => {
      state.word = null;
    },
  },
});
