import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { games } from '@scrabble-solver/configs';
import { EMPTY_CELL } from '@scrabble-solver/constants';
import { Board, Cell, type Result, Tile } from '@scrabble-solver/types';

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
        newBoard.updateCell(cell.x, cell.y, () => new Cell({ isEmpty: false, tile: cell.tile, x: cell.x, y: cell.y }));
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
        return new Cell({ isEmpty, tile, x: cell.x, y: cell.y });
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
        const tile = cell.isEmpty
          ? cell.tile
          : new Tile({ isBlank: !cell.tile.isBlank, character: cell.tile.character });
        return new Cell({ isEmpty: cell.isEmpty, tile, x: cell.x, y: cell.y });
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
        const newBoard = Board.create(config.boardWidth, config.boardHeight);
        const offsetX = Math.floor(config.boardWidth / 2) - Math.floor(state.rows[0].length / 2);
        const offsetY = Math.floor(config.boardHeight / 2) - Math.floor(state.rows.length / 2);

        for (let y = 0; y < state.rows.length; ++y) {
          for (let x = 0; x < state.rows[y].length; ++x) {
            const cell = state.rows[y][x];

            if (cell.isEmpty) {
              continue;
            }

            const newX = x + offsetX;
            const newY = y + offsetY;

            if (newX < 0 || newX >= config.boardWidth || newY < 0 || newY >= config.boardHeight) {
              continue;
            }

            newBoard.updateCell(newX, newY, () => new Cell({ ...cell, x: newX, y: newY }));
          }
        }

        return newBoard;
      }

      return state;
    });
  },
});
