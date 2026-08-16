import { createSelector } from '@reduxjs/toolkit';

import { selectLocale, selectShowCoordinates } from '../settings';
import type { RootState } from '../types';

import { getWordCoordinates, sortWords } from './lib';

const selectWordIndex = (_: unknown, index: number): number => index;

export const selectVerify = (state: RootState) => state.verify;

export const selectInvalidWords = createSelector([selectVerify], (verify) => verify.invalidWords);

export const selectValidWords = createSelector([selectVerify], (verify) => verify.validWords);

export const selectWordsSort = createSelector([selectVerify], (verify) => verify.sort);

export const selectCreatedWords = createSelector([selectInvalidWords, selectValidWords], (invalidWords, validWords) => {
  return [...invalidWords, ...validWords];
});

export const selectSortedWords = createSelector(
  [selectCreatedWords, selectWordsSort, selectLocale, selectShowCoordinates],
  sortWords,
);

export const selectWordCoordinates = createSelector(
  [selectSortedWords, selectShowCoordinates, selectWordIndex],
  (words, showCoordinates, index) => getWordCoordinates(words[index], showCoordinates),
);
