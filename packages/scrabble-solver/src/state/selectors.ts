import { createSelector } from '@reduxjs/toolkit';
import { Board, Bonus, Cell, Config, Result } from '@scrabble-solver/types';

import { selectConfig } from 'modules/config';
import { selectResultCandidate } from 'modules/results';
import { State } from 'state';

/////////
const selectResultCandidate: (state: State) => Result | undefined;
/////////

const getCell = (cells: Cell[], x: number, y: number): Cell | undefined =>
  cells.find((cell) => cell.x === x && cell.y === y);

export const selectBoard = (state: State): Board => state.board;

export const selectRows = createSelector<Cell[][]>(selectBoard, ({ board }) => board);

export const selectCells = createSelector(selectRows, (rows) => {
  return rows.reduce<Cell[]>((cells: Cell[], row: Cell[]) => cells.concat(row), []);
});

export const selectResultCandidateCells = createSelector(selectResultCandidate, (result: Result): Cell[] =>
  result ? result.cells : [],
);

export const selectRowsWithCandidate = createSelector<State, Board, State>(
  [selectRows, selectResultCandidateCells],
  (rows, cells) =>
    rows.map((row: Cell[], y: number) => row.map((cell: Cell, x: number) => getCell(cells, x, y) || cell)),
);

export const createSelectBonus = () => {
  return createSelector([selectConfig, (_: State, cell: Cell): Cell => cell], (config: Config, cell: Cell):
    | Bonus
    | undefined => config.bonuses.find((bonus: Bonus) => bonus.matchesCellCoordinates(cell)));
};

export const createSelectCharacterPoints = () => {
  return createSelector([selectConfig, (_: State, cell: Cell): Cell => cell], (config: Config, cell: Cell): number =>
    cell.tile.isBlank ? config.blankScore : config.pointsMap[cell.tile.character],
  );
};
