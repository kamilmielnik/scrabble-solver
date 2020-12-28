import { createSelector } from '@reduxjs/toolkit';
import { Board, Bonus, Cell, Config, Result } from '@scrabble-solver/models';

import { createKeyComparator, reverseComparator } from 'lib';

import { RootState } from './types';

const findCell = (cells: Cell[], x: number, y: number): Cell | undefined => {
  return cells.find((cell) => cell.x === x && cell.y === y);
};

const selectCell = (_: RootState, cell: Cell): Cell => cell;

const pointsComparator = reverseComparator(createKeyComparator('points'));

export const selectBoard = (state: RootState): Board => state.board;

// TODO: rename state.board.board to state.board.rows
export const selectRows = (state: RootState): Cell[][] => state.board.board;

export const selectCells = createSelector([selectRows], (rows) => {
  return rows.reduce<Cell[]>((cells: Cell[], row: Cell[]) => cells.concat(row), []);
});

export const selectConfig = (state: RootState): Config => state.config;

export const selectResults = (state: RootState): Result[] => [...state.results.results].sort(pointsComparator);

export const selectResultCandidate = (state: RootState): Result | null => state.results.candidate;

export const selectResultCandidateCells = createSelector(
  [selectResultCandidate],
  (resultCandidate) => (resultCandidate?.cells || []) as Cell[],
);

export const selectRowsWithCandidate = createSelector([selectRows, selectResultCandidateCells], (rows, cells) => {
  return rows.map((row: Cell[], y: number) => row.map((cell: Cell, x: number) => findCell(cells, x, y) || cell));
});

export const selectBonus = createSelector([selectConfig, selectCell], (config: Config, cell: Cell):
  | Bonus
  | undefined => {
  return config.bonuses.find((bonus: Bonus) => bonus.matchesCellCoordinates(cell));
});

export const selectCharacterPoints = createSelector(
  [selectConfig, selectCell],
  (config: Config, cell: Cell): number => {
    return cell.tile.isBlank ? config.blankScore : config.pointsMap[cell.tile.character];
  },
);
