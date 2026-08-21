import { createSelector } from '@reduxjs/toolkit';

import { createRegExp } from '@/lib/createRegExp';

import { selectLocale, selectShowCoordinates } from '../settings';
import type { RootState } from '../types';

import { getWordCoordinates, groupWords, sortWords } from './lib';

const selectWordIndex = (_: unknown, index: number): number => index;

export const selectVerify = (state: RootState) => state.verify;

export const selectLastVerifiedBoard = createSelector([selectVerify], (verify) => verify.lastSolvedParameters.board);

export const selectInvalidWords = createSelector([selectVerify], (verify) => verify.invalidWords);

export const selectValidWords = createSelector([selectVerify], (verify) => verify.validWords);

export const selectWordsQuery = createSelector([selectVerify], (verify) => verify.query);

export const selectWordsSort = createSelector([selectVerify], (verify) => verify.sort);

export const selectCreatedWords = createSelector([selectInvalidWords, selectValidWords], (invalidWords, validWords) => {
  return [...invalidWords, ...validWords];
});

const selectSortedWords = createSelector(
  [selectCreatedWords, selectWordsSort, selectLocale, selectShowCoordinates],
  sortWords,
);

export const selectProcessedWords = createSelector([selectSortedWords, selectWordsQuery], (words, query) => {
  const { matching, other } = groupWords(words, query);
  return [...matching, ...other];
});

export const selectIsWordMatching = createSelector(
  [selectProcessedWords, selectWordsQuery, selectWordIndex],
  (words, query, index) => createRegExp(query).test(words[index].word),
);

export const selectWordCoordinates = createSelector(
  [selectProcessedWords, selectShowCoordinates, selectWordIndex],
  (words, showCoordinates, index) => getWordCoordinates(words[index], showCoordinates),
);
