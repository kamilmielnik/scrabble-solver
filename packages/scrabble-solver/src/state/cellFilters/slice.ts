import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Cell } from '@scrabble-solver/types';

import type { Point } from 'types';

import { cellFiltersInitialState } from './initialState';
import { toggleCellFilterState } from './lib';

export const cellFiltersSlice = createSlice({
  initialState: cellFiltersInitialState,
  name: 'cellFilters',
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

    removeCells: (state, action: PayloadAction<Cell[]>) => {
      const cellsToRemove = action.payload;
      return state.filter((entry) =>
        cellsToRemove.every((cell) => cell.x !== entry.x || cell.y !== entry.y));
    },

    reset: () => cellFiltersInitialState,
  },
});
