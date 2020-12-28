import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Result } from '@scrabble-solver/models';

import resultsInitialState from './resultsInitialState';

const results = createSlice({
  initialState: resultsInitialState,
  name: 'results',
  reducers: {
    applyResult: (state) => {
      return { ...state, candidate: resultsInitialState.candidate };
    },

    changeResultCandidate: (state, action: PayloadAction<Result>) => {
      const candidate = action.payload;
      return { ...state, candidate };
    },

    changeResults: (state, action: PayloadAction<Result[]>) => {
      const newResults = action.payload;
      return { ...state, results: newResults };
    },
  },
});

export default results;
