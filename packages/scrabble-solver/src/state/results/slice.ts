import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Result } from '@scrabble-solver/types';

import { getNextSort } from '@/lib/getNextSort';
import { type ResultColumnId } from '@/types';

import { resultsInitialState } from './initialState';

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
      return { ...state, sort: getNextSort(state.sort, action.payload) };
    },

    reset: () => resultsInitialState,
  },
});
