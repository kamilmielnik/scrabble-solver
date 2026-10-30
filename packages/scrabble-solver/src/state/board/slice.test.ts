import { Board, Cell, Game, Tile } from '@scrabble-solver/types';

import { createResult } from '../../test/fixtures';
import { settingsSlice } from '../settings';

import { boardInitialState } from './initialState';
import { boardSlice } from './slice';

const { actions, reducer } = boardSlice;

describe('boardSlice', () => {
  it('starts as an empty standard scrabble board', () => {
    expect(boardInitialState.rowsCount).toBe(15);
    expect(boardInitialState.columnsCount).toBe(15);
    expect(boardInitialState.isEmpty()).toBe(true);
  });

  describe('applyResult', () => {
    it('places every cell of the result as a permanent tile without mutating the previous board', () => {
      const board = Board.create(15, 15);
      const next = reducer(board, actions.applyResult(createResult({ blanks: [1], word: 'cat', x: 3, y: 2 })));

      expect(next.rows[2][3].tile.character).toBe('c');
      expect(next.rows[2][4].tile.isBlank).toBe(true);
      expect(next.rows[2][5].isEmpty).toBe(false);
      expect(board.isEmpty()).toBe(true);
    });
  });

  describe('change and init', () => {
    it('replace the board', () => {
      const board = Board.fromStringArray(['ab', 'cd']);

      expect(reducer(boardInitialState, actions.change(board))).toBe(board);
      expect(reducer(boardInitialState, actions.init(board))).toBe(board);
    });
  });

  describe('changeCellValue', () => {
    it('writes a tile into a cell', () => {
      const next = reducer(Board.create(3, 3), actions.changeCellValue({ value: 'a', x: 1, y: 2 }));

      expect(next.rows[2][1].tile.character).toBe('a');
      expect(next.rows[2][1].isEmpty).toBe(false);
    });

    it('accepts a digraph as a single tile', () => {
      const next = reducer(Board.create(3, 3), actions.changeCellValue({ value: 'ch', x: 0, y: 0 }));

      expect(next.rows[0][0].tile.character).toBe('ch');
    });

    it.each(['', ' '])('clears a cell given the empty value %j', (value) => {
      const board = Board.fromStringArray(['a']);
      const next = reducer(board, actions.changeCellValue({ value, x: 0, y: 0 }));

      expect(next.rows[0][0].isEmpty).toBe(true);
      expect(next.rows[0][0].tile).toBe(Tile.Null);
    });

    it('does not mutate the previous board', () => {
      const board = Board.create(2, 2);

      reducer(board, actions.changeCellValue({ value: 'a', x: 0, y: 0 }));

      expect(board.isEmpty()).toBe(true);
    });
  });

  describe('toggleCellIsBlank', () => {
    it('flips the blank flag of a filled cell and keeps its letter', () => {
      const board = Board.fromStringArray(['a']);
      const blank = reducer(board, actions.toggleCellIsBlank({ x: 0, y: 0 }));
      const letter = reducer(blank, actions.toggleCellIsBlank({ x: 0, y: 0 }));

      expect(blank.rows[0][0].tile.isBlank).toBe(true);
      expect(blank.rows[0][0].tile.character).toBe('a');
      expect(letter.rows[0][0].tile.isBlank).toBe(false);
    });

    it('leaves an empty cell alone', () => {
      const next = reducer(Board.create(1, 1), actions.toggleCellIsBlank({ x: 0, y: 0 }));

      expect(next.rows[0][0].tile).toBe(Tile.Null);
      expect(next.rows[0][0].isEmpty).toBe(true);
    });
  });

  describe('when the game changes', () => {
    it('keeps the same board when the new game has the same dimensions', () => {
      const board = Board.create(15, 15);

      expect(reducer(board, settingsSlice.actions.changeGame(Game.Literaki))).toBe(board);
    });

    it('re-centres tiles on a bigger board', () => {
      const board = Board.create(15, 15);
      board.updateCell(7, 7, () => new Cell({ isEmpty: false, tile: new Tile({ character: 'a' }), x: 7, y: 7 }));

      const next = reducer(board, settingsSlice.actions.changeGame(Game.SuperScrabble));

      expect(next.rowsCount).toBe(21);
      expect(next.columnsCount).toBe(21);
      expect(next.rows[10][10].tile.character).toBe('a');
      expect(next.rows[10][10].x).toBe(10);
      expect(next.rows[10][10].y).toBe(10);
    });

    it('drops tiles that fall outside a smaller board and keeps the rest', () => {
      const board = Board.create(21, 21);
      board.updateCell(10, 10, () => new Cell({ isEmpty: false, tile: new Tile({ character: 'k' }), x: 10, y: 10 }));
      board.updateCell(0, 0, () => new Cell({ isEmpty: false, tile: new Tile({ character: 'z' }), x: 0, y: 0 }));
      board.updateCell(20, 10, () => new Cell({ isEmpty: false, tile: new Tile({ character: 'r' }), x: 20, y: 10 }));
      board.updateCell(10, 20, () => new Cell({ isEmpty: false, tile: new Tile({ character: 'b' }), x: 10, y: 20 }));

      const next = reducer(board, settingsSlice.actions.changeGame(Game.Scrabble));

      expect(next.getTilesCount()).toBe(1);
      expect(next.rows[7][7].tile.character).toBe('k');
    });

    it('resizes when only one dimension differs', () => {
      const board = Board.create(15, 11);

      const next = reducer(board, settingsSlice.actions.changeGame(Game.Scrabble));

      expect(next.rowsCount).toBe(15);
      expect(next.columnsCount).toBe(15);
    });

    it('rejects a game with no config', () => {
      expect(() => reducer(boardInitialState, settingsSlice.actions.changeGame('nonsense' as Game))).toThrow(
        'Cannot find config for game "nonsense"',
      );
    });
  });
});
