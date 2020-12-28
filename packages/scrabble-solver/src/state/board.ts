import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EMPTY_CELL } from '@scrabble-solver/constants';
import { Cell, Result, Tile } from '@scrabble-solver/models';

import boardInitialState from './boardInitialState';

const board = createSlice({
  initialState: boardInitialState,
  name: 'board',
  reducers: {
    applyResult: (state, action: PayloadAction<Result>) => {
      const board = state.clone();
      const result = action.payload;

      result.cells.forEach((cell) => {
        board.updateCell(cell.x, cell.y, () => new Cell({ ...cell, isEmpty: false }));
      });

      return board;
    },

    changeCellValue: (state, action: PayloadAction<{ value: string; x: number; y: number }>) => {
      const board = state.clone();
      const { value, x, y } = action.payload;
      const isEmpty = !value || value === EMPTY_CELL;

      board.updateCell(x, y, (cell) => {
        const tile = isEmpty ? Tile.Null : new Tile({ character: value });
        return new Cell({ ...cell, isEmpty, tile });
      });

      return board;
    },

    toggleCellIsBlank: (state, action: PayloadAction<{ x: number; y: number }>) => {
      const board = state.clone();
      const { x, y } = action.payload;

      board.updateCell(x, y, (cell) => {
        const tile = cell.isEmpty ? cell.tile : new Tile({ ...cell.tile, isBlank: !cell.tile.isBlank });
        return new Cell({ ...cell, tile });
      });

      return board;
    },
  },
});

export default board;
