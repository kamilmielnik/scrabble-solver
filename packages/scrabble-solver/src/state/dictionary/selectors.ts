import { createSelector } from '@reduxjs/toolkit';
import { isError } from '@scrabble-solver/types';

import type { RootState } from '../types';

export const selectDictionary = (state: RootState) => state.dictionary;

export const selectDictionaryInput = createSelector([selectDictionary], (dictionary) => dictionary.input);

export const selectDictionaryResults = createSelector([selectDictionary], (dictionary) => dictionary.results);

export const selectDictionaryIsLoading = createSelector([selectDictionary], (dictionary) => dictionary.isLoading);

export const selectDictionaryError = createSelector([selectDictionary], (dictionary) => {
  return isError(dictionary.error) ? dictionary.error : undefined;
});
