import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Board } from '@scrabble-solver/types';

import { solveInitialState } from './initialState';

interface SolveParameters {
  board: Board;
  characters: string[];
}

export const solveSlice = createSlice({
  initialState: solveInitialState,
  name: 'solve',
  reducers: {
    reset: () => solveInitialState,

    submit: (state) => {
      const error = solveInitialState.error;
      return { ...state, error, isLoading: true };
    },

    submitFailure: (state, action: PayloadAction<unknown>) => {
      const error = action.payload;
      return { ...state, error, isLoading: false };
    },

    submitSuccess: (state, action: PayloadAction<SolveParameters>) => {
      const error = solveInitialState.error;
      const lastSolvedParameters = action.payload;
      return { ...state, error, isLoading: false, lastSolvedParameters };
    },
  },
});
