import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SolveParameters } from 'types';

import solveInitialState from './solveInitialState';

const solveSlice = createSlice({
  initialState: solveInitialState,
  name: 'solve',
  reducers: {
    submit: (state) => {
      return { ...state, isLoading: true };
    },

    submitFailure: (state) => {
      return { ...state, isLoading: false };
    },

    submitSuccess: (state, action: PayloadAction<SolveParameters>) => {
      const lastSolvedParameters = action.payload;
      return { ...state, isLoading: false, lastSolvedParameters };
    },
  },
});

export default solveSlice;
