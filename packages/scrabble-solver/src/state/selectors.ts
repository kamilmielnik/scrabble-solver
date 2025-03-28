import { createSelector } from '@reduxjs/toolkit';

import { getRemainingTiles, unorderedArraysEqual } from 'lib';

import { selectBoard } from './board';
import { selectCharacters } from './rack';
import { selectConfig, selectLocale } from './settings';
import { selectLastSolvedParameters } from './solve';

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

export const selectRemainingTiles = createSelector(
  [selectConfig, selectBoard, selectCharacters, selectLocale],
  getRemainingTiles,
);
