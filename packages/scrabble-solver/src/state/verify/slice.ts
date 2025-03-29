import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Board } from '@scrabble-solver/types';

import { verifyInitialState } from './initialState';

interface VerifyParameters {
  board: Board;
  invalidWords: string[];
  validWords: string[];
}

export const verifySlice = createSlice({
  initialState: verifyInitialState,
  name: 'verify',
  reducers: {
    submit: (state) => {
      return { ...state, isLoading: true };
    },

    submitFailure: (state) => {
      return { ...state, isLoading: false };
    },

    submitSuccess: (state, action: PayloadAction<VerifyParameters>) => {
      const { board, invalidWords, validWords } = action.payload;
      return { ...state, isLoading: false, lastSolvedParameters: { board }, invalidWords, validWords };
    },
  },
});
