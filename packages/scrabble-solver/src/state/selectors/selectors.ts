import { createSelector } from '@reduxjs/toolkit';
import { Cell } from '@scrabble-solver/types';

import { LOCALE_FEATURES } from 'i18n';
import { findCell, getRemainingTiles, getRemainingTilesGroups, unorderedArraysEqual } from 'lib';
import { ResultColumnId } from 'types';

import { selectCharacters } from './rack';
import { selectResultCandidateCells } from './results';
import { selectBoard } from './root';
import { selectConfig, selectLocale, selectShowCoordinates } from './settings';
import { selectLastSolvedParameters } from './solve';

export const selectRowsWithCandidate = createSelector([selectBoard, selectResultCandidateCells], (board, cells) => {
  return board.rows.map((row: Cell[], y: number) => row.map((cell: Cell, x: number) => findCell(cells, x, y) || cell));
});

const selectHaveCharactersChanged = createSelector(
  [selectLastSolvedParameters, selectCharacters, selectLocale],
  (lastSolvedParameters, characters, locale) => {
    return !unorderedArraysEqual(lastSolvedParameters.characters, characters, locale);
  },
);

const selectHasBoardChanged = createSelector(
  [selectLastSolvedParameters, selectBoard],
  (lastSolvedParameters, board) => !lastSolvedParameters.board.equals(board),
);

export const selectAreResultsOutdated = createSelector(
  [selectHasBoardChanged, selectHaveCharactersChanged],
  (hasBoardChanged, haveCharactersChanged) => hasBoardChanged || haveCharactersChanged,
);

export const selectRemainingTiles = createSelector(
  [selectConfig, selectBoard, selectCharacters, selectLocale],
  getRemainingTiles,
);

export const selectRemainingTilesGroups = createSelector([selectRemainingTiles], getRemainingTilesGroups);

export const selectColumns = createSelector([selectLocale, selectShowCoordinates], (locale, showCoordinates) => {
  const { consonants, vowels } = LOCALE_FEATURES[locale];
  const columns: ResultColumnId[] = [
    ResultColumnId.Word,
    ResultColumnId.TilesCount,
    ResultColumnId.BlanksCount,
    ResultColumnId.WordsCount,
    ResultColumnId.Points,
  ];

  if (showCoordinates !== 'hidden') {
    columns.push(ResultColumnId.Coordinates);
  }

  if (vowels) {
    columns.push(ResultColumnId.VowelsCount);
  }

  if (consonants) {
    columns.push(ResultColumnId.ConsonantsCount);
  }

  return columns;
});
