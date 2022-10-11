import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import cellFilterInitialState, { Point } from './cellFilterInitialState';

const cellFilterSlice = createSlice({
  initialState: cellFilterInitialState,
  name: 'cellFilter',
  reducers: {
    toggle: (state, action: PayloadAction<Point>) => {
      const { x, y } = action.payload;
      const has = state.some((point) => point.x === x && point.y === y);

      if (has) {
        return state.filter((point) => point.x !== x || point.y !== y);
      }

      return [...state, action.payload];
    },

    reset: () => cellFilterInitialState,
  },
});

export default cellFilterSlice;
