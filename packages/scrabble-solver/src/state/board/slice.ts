import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { games } from '@scrabble-solver/configs';
import { EMPTY_CELL } from '@scrabble-solver/constants';
import { type Board, type Result, Cell, Tile } from '@scrabble-solver/types';

import { fitBoardToSize } from '@/lib/fitBoardToSize';

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

      return fitBoardToSize(state, { height: config.boardHeight, width: config.boardWidth });
    });
  },
});
