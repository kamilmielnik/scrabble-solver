import { createSelector } from '@reduxjs/toolkit';

import { findCell } from '@/lib/findCell';
import {
  selectBoard,
  selectCharacters,
  selectHighlightUnreachableCells,
  selectResultCandidateCells,
  selectUpToDateResults,
} from '@/state';

import { getReachableCells, getReachableCellsFromResults } from './lib';

export const selectRowsWithCandidate = createSelector([selectBoard, selectResultCandidateCells], (board, cells) => {
  return board.rows.map((row, y) => row.map((cell, x) => findCell(cells, x, y) || cell));
});

export const selectReachableCells = createSelector(
  [selectBoard, selectCharacters, selectHighlightUnreachableCells, selectUpToDateResults],
  (board, characters, highlightUnreachableCells, upToDateResults): boolean[][] | null => {
    if (!highlightUnreachableCells || characters.length === 0) {
      return null;
    }

    if (upToDateResults) {
      return getReachableCellsFromResults(board, upToDateResults);
    }

    return getReachableCells(board, characters.length);
  },
);
