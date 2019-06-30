import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import { selectConfig } from 'config/selectors';
import { selectResultCandidate } from 'shared/selectors';

const getCell = (cells, x, y) => cells.find((cell) => cell.x === x && cell.y === y);

export const selectBoard = (state) => state.board;
export const selectRows = createSelector(
  selectBoard,
  ({ board }) => board
);
export const selectCells = createSelector(
  selectRows,
  (rows) => rows.reduce((cells, row) => cells.concat(row), [])
);
export const selectResultCandidateCells = createSelector(
  selectResultCandidate,
  (result) => (result ? result.cells : [])
);
export const selectRowsWithCandidate = createSelector(
  [selectRows, selectResultCandidateCells],
  (rows, cells) => rows.map((row, y) => row.map((cell, x) => getCell(cells, x, y) || cell))
);
export const selectBonus = createCachedSelector([selectConfig, (state, cell) => cell], (config, cell) =>
  config.bonuses.find((bonus) => bonus.matchesCellCoordinates(cell))
)((state, { x, y }) => `${x}-${y}`);
export const selectCharacterPoints = createCachedSelector(
  [selectConfig, (state, cell) => cell],
  (config, cell) => config.pointsMap[cell.tile.character]
)((state, { x, y }) => `${x}-${y}`);
