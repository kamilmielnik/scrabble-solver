import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Board, type BoardWord } from '@scrabble-solver/types';

import { getNextSort } from '@/lib/getNextSort';
import { type WordColumnId } from '@/types';

import { verifyInitialState } from './initialState';

interface VerifyParameters {
  board: Board;
  invalidWords: BoardWord[];
  validWords: BoardWord[];
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

    sort: (state, action: PayloadAction<WordColumnId>) => {
      return { ...state, sort: getNextSort(state.sort, action.payload) };
    },

    submitSuccess: (state, action: PayloadAction<VerifyParameters>) => {
      const { board, invalidWords, validWords } = action.payload;
      return { ...state, isLoading: false, lastSolvedParameters: { board }, invalidWords, validWords };
    },
  },
});
