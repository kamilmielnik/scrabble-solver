import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { games } from '@scrabble-solver/configs';
import { EMPTY_CELL } from '@scrabble-solver/constants';
import { Board, Cell, Result, Tile } from '@scrabble-solver/types';

import { settingsSlice } from '../settings';

import { boardInitialState } from './initialState';

export const boardSlice = createSlice({
  initialState: boardInitialState,
  name: 'board',
  reducers: {
    applyResult: (state, action: PayloadAction<Result>) => {
      const newBoard = state.clone();
      const result = action.payload;

      result.cells.forEach((cell) => {
        newBoard.updateCell(cell.x, cell.y, () => new Cell({ ...cell, isEmpty: false }));
      });

      return newBoard;
    },

    change: (_state, action: PayloadAction<Board>) => {
      const board = action.payload;
      return board;
    },

    changeCellValue: (state, action: PayloadAction<{ value: string; x: number; y: number }>) => {
      const newBoard = state.clone();
      const { value, x, y } = action.payload;
      const isEmpty = !value || value === EMPTY_CELL;
      const tile = isEmpty ? Tile.Null : new Tile({ character: value });

      newBoard.updateCell(x, y, (cell) => {
        return new Cell({ ...cell, isEmpty, tile });
      });

      return newBoard;
    },

    init: (_state, action: PayloadAction<Board>) => {
      const board = action.payload;
      return board;
    },

    toggleCellIsBlank: (state, action: PayloadAction<{ x: number; y: number }>) => {
      const newBoard = state.clone();
      const { x, y } = action.payload;

      newBoard.updateCell(x, y, (cell) => {
        const tile = cell.isEmpty ? cell.tile : new Tile({ ...cell.tile, isBlank: !cell.tile.isBlank });
        return new Cell({ ...cell, tile });
      });

      return newBoard;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(settingsSlice.actions.changeGame, (state, action) => {
      const game = action.payload;
      const config = Object.values(games).find((gameConfig) => gameConfig.game === game);

      if (!config) {
        throw new Error(`Cannot find config for game "${game}"`);
      }

      if (state.rows.length !== config.boardHeight || state.rows[0].length !== config.boardWidth) {
        return Board.create(config.boardWidth, config.boardHeight);
      }

      return state;
    });
  },
});
