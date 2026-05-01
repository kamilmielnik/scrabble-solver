import { createSelector } from '@reduxjs/toolkit';

import { findCell } from '@/lib';
import {
  selectBoard,
  selectCharacters,
  selectConfig,
  selectHighlightUnreachableCells,
  selectResultCandidateCells,
} from '@/state';

import { getReachableCells } from './lib';

export const selectRowsWithCandidate = createSelector([selectBoard, selectResultCandidateCells], (board, cells) => {
  return board.rows.map((row, y) => row.map((cell, x) => findCell(cells, x, y) || cell));
});

export const selectReachableCells = createSelector(
  [selectConfig, selectBoard, selectCharacters, selectHighlightUnreachableCells],
  (config, board, characters, highlightUnreachableCells): boolean[][] | null => {
    if (!highlightUnreachableCells || characters.length === 0) {
      return null;
    }

    return getReachableCells(config, board, characters.length);
  },
);
