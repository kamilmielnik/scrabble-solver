import { getConfig } from '@scrabble-solver/configs';
import { type BoardJson, type CellJson, Board, Game, Locale } from '@scrabble-solver/types';

import { isBoardValid, isCellValid, isCharacterValid, isRowValid } from '.';

const config = getConfig(Game.Scrabble, Locale.EN_US);
const spanish = getConfig(Game.Scrabble, Locale.ES_ES);

describe('isCharacterValid', () => {
  it('accepts one and two character tiles', () => {
    expect(isCharacterValid('a')).toBe(true);
    expect(isCharacterValid('ch')).toBe(true);
  });

  it('rejects empty and longer strings', () => {
    expect(isCharacterValid('')).toBe(false);
    expect(isCharacterValid('abc')).toBe(false);
  });
});

describe('isCellValid', () => {
  it('accepts an empty cell and a filled cell', () => {
    expect(isCellValid(createCell({}), config)).toBe(true);
    expect(isCellValid(createCell({ isEmpty: false, tile: { character: 'a', isBlank: false } }), config)).toBe(true);
  });

  it.each([
    ['x', -1],
    ['x', 15],
    ['y', -1],
    ['y', 15],
  ])('rejects %s = %d outside the board', (axis, value) => {
    expect(isCellValid(createCell({ [axis]: value }), config)).toBe(false);
  });

  it('accepts the last cell of the board', () => {
    expect(isCellValid(createCell({ x: 14, y: 14 }), config)).toBe(true);
  });

  it('rejects an empty cell that claims a tile', () => {
    expect(isCellValid(createCell({ tile: { character: 'a', isBlank: false } }), config)).toBe(false);
  });

  it('rejects a tile with an invalid character', () => {
    expect(isCellValid(createCell({ isEmpty: false, tile: { character: 'abc', isBlank: false } }), config)).toBe(false);
  });
});

describe('isRowValid', () => {
  const row = Board.create(15, 1).toJson()[0];

  it('accepts a row of the board width', () => {
    expect(isRowValid(row, config)).toBe(true);
  });

  it('rejects a row of another width', () => {
    expect(isRowValid(row.slice(1), config)).toBe(false);
  });

  it('rejects a row with an invalid cell', () => {
    expect(isRowValid([...row.slice(1), createCell({ x: 99 })], config)).toBe(false);
  });
});

describe('isBoardValid', () => {
  it('accepts an empty board of the right size', () => {
    expect(isBoardValid(createBoard(), config)).toBe(true);
  });

  it('rejects a board of another height', () => {
    expect(isBoardValid(createBoard().slice(1), config)).toBe(false);
  });

  it('rejects a board with an invalid row', () => {
    const board = createBoard();
    board[3] = board[3].slice(1);

    expect(isBoardValid(board, config)).toBe(false);
  });

  it('accepts adjacent letters in a language without two-letter tiles', () => {
    expect(
      isBoardValid(
        place(createBoard(), [
          ['c', 0, 0],
          ['h', 1, 0],
        ]),
        config,
      ),
    ).toBe(true);
  });

  it('rejects a two-letter tile spelled with two tiles across', () => {
    expect(
      isBoardValid(
        place(createBoard(), [
          ['c', 3, 3],
          ['h', 4, 3],
        ]),
        spanish,
      ),
    ).toBe(false);
  });

  it('rejects a two-letter tile spelled with two tiles down', () => {
    expect(
      isBoardValid(
        place(createBoard(), [
          ['r', 3, 3],
          ['r', 3, 4],
        ]),
        spanish,
      ),
    ).toBe(false);
  });

  it('accepts the real two-letter tile', () => {
    expect(
      isBoardValid(
        place(createBoard(), [
          ['ch', 3, 3],
          ['a', 4, 3],
        ]),
        spanish,
      ),
    ).toBe(true);
  });

  it('accepts the two letters when they do not touch', () => {
    expect(
      isBoardValid(
        place(createBoard(), [
          ['c', 3, 3],
          ['h', 5, 3],
        ]),
        spanish,
      ),
    ).toBe(true);
  });

  it('accepts a prefix letter on the last row and column', () => {
    expect(isBoardValid(place(createBoard(), [['c', 14, 14]]), spanish)).toBe(true);
  });
});

function createCell(overrides: Partial<CellJson>): CellJson {
  return { isEmpty: true, tile: null, x: 0, y: 0, ...overrides };
}

function createBoard(): BoardJson {
  return Board.create(15, 15).toJson();
}

function place(board: BoardJson, tiles: [string, number, number][]): BoardJson {
  for (const [character, x, y] of tiles) {
    board[y][x] = createCell({ isEmpty: false, tile: { character, isBlank: false }, x, y });
  }

  return board;
}
