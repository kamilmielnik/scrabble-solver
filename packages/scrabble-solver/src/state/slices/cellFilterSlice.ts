import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CellFilterType, Point } from 'types';

import cellFilterInitialState from './cellFilterInitialState';

const cellFilterSlice = createSlice({
  initialState: cellFilterInitialState,
  name: 'cellFilter',
  reducers: {
    toggle: (state, action: PayloadAction<Point>) => {
      const { x, y } = action.payload;
      const currentEntry = state.find((point) => point.x === x && point.y === y);
      const has = Boolean(currentEntry);
      const nextType = currentEntry ? toggleCellFilterState(currentEntry.type) : 'include';

      if (nextType === null) {
        return state.filter((point) => point.x !== x || point.y !== y);
      }

      if (!has) {
        return [...state, { ...action.payload, type: nextType }];
      }

      return state.map((entry) => {
        if (entry.x === x && entry.y === y) {
          return { ...entry, type: nextType };
        }

        return entry;
      });
    },

    cancel: (state, action: PayloadAction<Point>) => {
      const { x, y } = action.payload;

      return state.filter((point) => point.x !== x || point.y !== y);
    },

    reset: () => cellFilterInitialState,
  },
});

const toggleCellFilterState = (type: CellFilterType): CellFilterType => {
  const chain: CellFilterType[] = ['include', 'exclude', null];
  const index = chain.indexOf(type);
  const nextIndex = (index + 1) % chain.length;
  return chain[nextIndex];
};

export default cellFilterSlice;
