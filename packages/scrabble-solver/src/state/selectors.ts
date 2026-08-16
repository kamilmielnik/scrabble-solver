import { createSelector } from '@reduxjs/toolkit';

import { unorderedArraysEqual } from '@/lib/unorderedArraysEqual';

import { selectBoard } from './board';
import { getRemainingTiles } from './lib';
import { selectCharacters } from './rack';
import { selectResultsResults } from './results';
import { selectConfig, selectLocale } from './settings';
import { selectLastSolvedParameters, selectSolveError } from './solve';

const selectHasBoardChanged = createSelector(
  [selectLastSolvedParameters, selectBoard],
  (lastSolvedParameters, board) => {
    return !lastSolvedParameters.board.equals(board);
  },
);

const selectHaveCharactersChanged = createSelector(
  [selectLastSolvedParameters, selectCharacters, selectLocale],
  (lastSolvedParameters, characters, locale) => {
    return !unorderedArraysEqual(lastSolvedParameters.characters, characters, locale);
  },
);

export const selectAreResultsOutdated = createSelector(
  [selectHasBoardChanged, selectHaveCharactersChanged],
  (hasBoardChanged, haveCharactersChanged) => {
    return hasBoardChanged || haveCharactersChanged;
  },
);

export const selectUpToDateResults = createSelector(
  [selectResultsResults, selectAreResultsOutdated, selectSolveError],
  (results, areResultsOutdated, solveError) => {
    return results && !areResultsOutdated && !solveError ? results : null;
  },
);

export const selectRemainingTiles = createSelector(
  [selectConfig, selectBoard, selectCharacters, selectLocale],
  getRemainingTiles,
);
