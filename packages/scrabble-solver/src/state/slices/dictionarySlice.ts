import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WordDefinition } from '@scrabble-solver/types';

import dictionaryInitialState from './dictionaryInitialState';

const dictionarySlice = createSlice({
  initialState: dictionaryInitialState,
  name: 'dictionary',
  reducers: {
    changeInput: (state, action: PayloadAction<string>) => {
      return { ...state, input: action.payload };
    },

    reset: () => dictionaryInitialState,

    submit: (state) => {
      return {
        ...state,
        isLoading: true,
        results: dictionaryInitialState.results,
      };
    },

    submitFailure: (state) => {
      return {
        ...state,
        isLoading: false,
        results: dictionaryInitialState.results,
      };
    },

    submitSuccess: (state, action: PayloadAction<WordDefinition[]>) => {
      return {
        ...state,
        isLoading: false,
        results: action.payload,
      };
    },
  },
});

export default dictionarySlice;
