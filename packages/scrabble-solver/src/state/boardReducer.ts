import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EMPTY_CELL } from '@scrabble-solver/constants';
import { Board, Cell, Result, Tile } from '@scrabble-solver/models';

import boardReducerInitialState from './boardReducerInitialState';

const slice = createSlice({
  initialState: boardReducerInitialState,
  name: 'board',
  reducers: {
    applyResult: (state, action: PayloadAction<Result>) => {
      const result = action.payload;

      return new Board({
        board: state.board.map((row, y) =>
          row.map((cell, x) => {
            const newCell = getCell(result.cells, x, y);
            if (newCell) {
              return new Cell({
                ...newCell,
                isEmpty: false,
              });
            }
            return cell;
          }),
        ),
      });
    },

    changeCellValue: (state, action: PayloadAction<{ value: string; x: number; y: number }>) => {
      const { value, x, y } = action.payload;
      const isEmpty = !value || value === EMPTY_CELL;

      return updateBoardCell(state, {
        x,
        y,
        updateCell: (cell) =>
          new Cell({
            ...cell,
            tile: isEmpty ? Tile.Null : new Tile({ character: value }),
            isEmpty,
          }),
      });
    },

    toggleCellIsBlank: (state, action: PayloadAction<{ x: number; y: number }>) => {
      const { x, y } = action.payload;

      return updateBoardCell(state, {
        x,
        y,
        updateCell: (cell) =>
          new Cell({
            ...cell,
            tile: cell.isEmpty ? cell.tile : new Tile({ ...cell.tile, isBlank: !cell.tile.isBlank }),
          }),
      });
    },
  },
});

const updateBoardCell = (
  state: Board,
  { updateCell, x, y }: { updateCell: (cell: Cell) => Cell; x: number; y: number },
): Board => {
  return updateBoardRow(state, {
    y,
    updateRow: (row) => [...row.slice(0, x), updateCell(row[x]), ...row.slice(x + 1)],
  });
};

const updateBoardRow = (state: Board, { updateRow, y }: { updateRow: (cells: Cell[]) => Cell[]; y: number }): Board => {
  return new Board({
    board: [...state.board.slice(0, y), updateRow(state.board[y]), ...state.board.slice(y + 1)],
  });
};

const getCell = (cells: Cell[], x: number, y: number): Cell | undefined => {
  return cells.find((cell) => cell.x === x && cell.y === y);
};

const { actions: boardActions, reducer: boardReducer } = slice;

export { boardActions };

export default boardReducer;
