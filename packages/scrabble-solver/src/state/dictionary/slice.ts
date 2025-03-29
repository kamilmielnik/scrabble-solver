import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WordDefinition } from '@scrabble-solver/types';

import { dictionaryInitialState } from './initialState';

export const dictionarySlice = createSlice({
  initialState: dictionaryInitialState,
  name: 'dictionary',
  reducers: {
    changeInput: (state, action: PayloadAction<string>) => {
      return { ...state, input: action.payload };
    },

    reset: () => dictionaryInitialState,

    submit: (state) => {
      const error = dictionaryInitialState.error;
      const results = dictionaryInitialState.results;
      return { ...state, error, isLoading: true, results };
    },

    submitFailure: (state, action: PayloadAction<unknown>) => {
      const error = action.payload;
      const results = dictionaryInitialState.results;
      return { ...state, error, isLoading: false, results };
    },

    submitSuccess: (state, action: PayloadAction<WordDefinition[]>) => {
      const error = dictionaryInitialState.error;
      const results = action.payload;
      return { ...state, error, isLoading: false, results };
    },
  },
});
