import { createSlice } from '@reduxjs/toolkit';

import solveInitialState from './solveInitialState';

const solve = createSlice({
  initialState: solveInitialState,
  name: 'solve',
  reducers: {
    submit: (state) => {
      return { ...state, isLoading: true };
    },

    submitFailure: (state) => {
      return { ...state, isLoading: false };
    },

    submitSuccess: (state) => {
      return { ...state, isLoading: false };
    },
  },
});

export default solve;
