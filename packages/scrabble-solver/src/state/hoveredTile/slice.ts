import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { hoveredTileInitialState } from './initialState';

export const hoveredTileSlice = createSlice({
  initialState: hoveredTileInitialState,
  name: 'hoveredTile',
  reducers: {
    set: (state, action: PayloadAction<string>) => {
      state.character = action.payload;
    },
    clear: (state) => {
      state.character = null;
    },
  },
});
