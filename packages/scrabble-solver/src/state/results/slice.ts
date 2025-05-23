import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Result } from '@scrabble-solver/types';

import { type ResultColumnId, SortDirection } from 'types';

import { resultsInitialState } from './initialState';

const toggleDirection = (direction: SortDirection): SortDirection => {
  return direction === SortDirection.Ascending ? SortDirection.Descending : SortDirection.Ascending;
};

export const resultsSlice = createSlice({
  initialState: resultsInitialState,
  name: 'results',
  reducers: {
    applyResult: (_state, _action: PayloadAction<Result>) => {
      return resultsInitialState;
    },

    changeQuery: (state, action: PayloadAction<string>) => {
      const newQuery = action.payload;
      return { ...state, query: newQuery };
    },

    changeResultCandidate: (state, action: PayloadAction<Result | null>) => {
      const candidate = action.payload;
      return { ...state, candidate };
    },

    changeResults: (state, action: PayloadAction<Result[]>) => {
      const newResults = action.payload;
      return {
        ...state,
        candidate: resultsInitialState.candidate,
        query: resultsInitialState.query,
        results: newResults,
      };
    },

    sort: (state, action: PayloadAction<ResultColumnId>) => {
      const columndId = action.payload;
      const { column, direction } = state.sort;

      return {
        ...state,
        sort: {
          column: columndId,
          direction: column === columndId ? toggleDirection(direction) : direction,
        },
      };
    },

    reset: () => resultsInitialState,
  },
});
