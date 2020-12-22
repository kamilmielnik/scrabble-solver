import { createSelector } from 'reselect';

import { selectConfig } from 'modules/config';
import { selectResultCandidate } from 'modules/results';

const getCell = (cells, x, y) => cells.find((cell) => cell.x === x && cell.y === y);

export const selectBoard = (state) => state.board;
export const selectRows = createSelector(selectBoard, ({ board }) => board);
export const selectCells = createSelector(selectRows, (rows) => rows.reduce((cells, row) => cells.concat(row), []));
export const selectResultCandidateCells = createSelector(selectResultCandidate, (result) =>
  result ? result.cells : [],
);
export const selectRowsWithCandidate = createSelector([selectRows, selectResultCandidateCells], (rows, cells) =>
  rows.map((row, y) => row.map((cell, x) => getCell(cells, x, y) || cell)),
);
export const createSelectBonus = () =>
  createSelector([selectConfig, (state, cell) => cell], (config, cell) =>
    config.bonuses.find((bonus) => bonus.matchesCellCoordinates(cell)),
  );
export const createSelectCharacterPoints = () =>
  createSelector([selectConfig, (state, cell) => cell], (config, cell) =>
    cell.tile.isBlank ? config.blankScore : config.pointsMap[cell.tile.character],
  );
