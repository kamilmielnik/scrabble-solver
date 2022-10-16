import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Board } from '@scrabble-solver/types';

import solveInitialState from './solveInitialState';

interface SolveParameters {
  board: Board;
  characters: string[];
}

const solveSlice = createSlice({
  initialState: solveInitialState,
  name: 'solve',
  reducers: {
    submit: (state) => {
      return { ...state, isLoading: true };
    },

    submitFailure: (state, action: PayloadAction<unknown>) => {
      const error = action.payload;
      return { ...state, error, isLoading: false };
    },

    submitSuccess: (state, action: PayloadAction<SolveParameters>) => {
      const lastSolvedParameters = action.payload;
      return { ...state, error: undefined, isLoading: false, lastSolvedParameters };
    },
  },
});

export default solveSlice;
