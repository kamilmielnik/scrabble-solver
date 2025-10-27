import { Cell, Tile, type Result } from '@scrabble-solver/types';
import { createSelector } from '@reduxjs/toolkit';

import { findCell } from 'lib';
import { selectBoard, selectProcessedResults, selectResultCandidateCells, selectResultsDisplayMode } from 'state';

const MAX_HINT_RESULTS = 3;

const createHintCells = (results: Result[] | undefined, displayMode: 'normal' | 'shortHint' | 'longHint'): Cell[] => {
  if (!results || displayMode === 'normal') {
    return [];
  }

  const topResults = results.slice(0, MAX_HINT_RESULTS);

  return topResults.flatMap((result, index) => {
    const rank = index + 1;
    const cells = displayMode === 'shortHint' ? result.cells.slice(0, 1) : result.cells;

    return cells.map((cell) => {
      const clone = cell.clone();
      clone.tile = Tile.Null;
      (clone as Cell & { hintRank?: number }).hintRank = rank;
      return clone;
    });
  });
};

export const selectRowsWithCandidate = createSelector(
  [selectBoard, selectResultCandidateCells, selectResultsDisplayMode, selectProcessedResults],
  (board, candidateCells, displayMode, results) => {
    const hintCells = createHintCells(results, displayMode);

    return board.rows.map((row, y) =>
      row.map((cell, x) => {
        const candidateCell = findCell(candidateCells, x, y);

        if (candidateCell) {
          return candidateCell;
        }

        const hintCell = findCell(hintCells, x, y) as (Cell & { hintRank?: number }) | undefined;

        if (hintCell && typeof hintCell.hintRank === 'number') {
          const clone = cell.clone();
          (clone as Cell & { hintRank?: number }).hintRank = hintCell.hintRank;
          return clone;
        }

        return cell;
      }),
    );
  },
);
