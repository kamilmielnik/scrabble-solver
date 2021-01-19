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
        // TODO: decide if should keep or not
        // It affects the loading state

        // definitions: dictionaryInitialState.definitions,
        // isAllowed: dictionaryInitialState.isAllowed,
        isLoading: true,
        // word: dictionaryInitialState.word,
      };
    },

    submitFailure: (state) => {
      return {
        ...state,
        definitions: dictionaryInitialState.definitions,
        isAllowed: false,
        isLoading: false,
        word: state.input,
      };
    },

    submitSuccess: (state, action: PayloadAction<WordDefinition>) => {
      return {
        ...state,
        definitions: action.payload.definitions,
        isAllowed: action.payload.isAllowed,
        isLoading: false,
        word: action.payload.word,
      };
    },
  },
});

export default dictionarySlice;
