import { createSelector } from '@reduxjs/toolkit';

import { findCell } from 'lib';
import { selectBoard, selectResultCandidateCells } from 'state';

export const selectRowsWithCandidate = createSelector([selectBoard, selectResultCandidateCells], (board, cells) => {
  return board.rows.map((row, y) => row.map((cell, x) => findCell(cells, x, y) || cell));
});
