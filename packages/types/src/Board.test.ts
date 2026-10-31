/* eslint-disable max-lines */
import { describe, expect, it } from 'bun:test';

import { Board } from './Board';
import { type BoardJson } from './BoardJson';
import { Cell } from './Cell';
import { Tile } from './Tile';

describe('Board.getWords', () => {
  it('returns no words for an empty board', () => {
    const board = Board.fromStringArray(['     ', '     ', '     ', '     ', '     ']);

    expect(board.getWords()).toEqual([]);
  });

  it('locates a horizontal word', () => {
    const board = Board.fromStringArray(['     ', ' cat ', '     ', '     ', '     ']);

    expect(board.getWords()).toEqual([{ direction: 'horizontal', word: 'cat', x: 1, y: 1 }]);
  });

  it('locates a vertical word', () => {
    const board = Board.fromStringArray(['     ', '  c  ', '  a  ', '  t  ', '     ']);

    expect(board.getWords()).toEqual([{ direction: 'vertical', word: 'cat', x: 2, y: 1 }]);
  });

  it('locates crossing words in both directions', () => {
    const board = Board.fromStringArray(['     ', ' cat ', ' o   ', ' d   ', '     ']);

    expect(board.getWords()).toEqual([
      { direction: 'horizontal', word: 'cat', x: 1, y: 1 },
      { direction: 'vertical', word: 'cod', x: 1, y: 1 },
    ]);
  });

  it('distinguishes the same word at different positions', () => {
    const board = Board.fromStringArray(['cat  ', '     ', '  cat', '     ', '     ']);

    expect(board.getWords()).toEqual([
      { direction: 'horizontal', word: 'cat', x: 0, y: 0 },
      { direction: 'horizontal', word: 'cat', x: 2, y: 2 },
    ]);
  });

  it('skips single-tile runs', () => {
    const board = Board.fromStringArray(['     ', ' a   ', '     ', '   to', '     ']);

    expect(board.getWords()).toEqual([{ direction: 'horizontal', word: 'to', x: 3, y: 3 }]);
  });

  /**
   * #398 - Solitary digraph tiles are recognized as created words
   * @see https://github.com/kamilmielnik/scrabble-solver/issues/398
   */
  it('locates a word with a digraph tile occupying a single cell (#398)', () => {
    const board = Board.fromStringArray(['   ', '  e', '   ']);
    board.updateCell(1, 1, () => new Cell({ isEmpty: false, tile: new Tile({ character: 'ch' }), x: 1, y: 1 }));

    expect(board.getWords()).toEqual([{ direction: 'horizontal', word: 'che', x: 1, y: 1 }]);
  });
});

describe('Board.getWords on non-square boards', () => {
  it('reads a wide board', () => {
    const board = Board.fromStringArray(['      a', 'cat   t']);

    expect(board.getWords()).toEqual([
      { direction: 'horizontal', word: 'cat', x: 0, y: 1 },
      { direction: 'vertical', word: 'at', x: 6, y: 0 },
    ]);
  });

  it('reads a tall board', () => {
    const board = Board.fromStringArray(['  ', 'at', '  ', ' c', ' a', ' t']);

    expect(board.getWords()).toEqual([
      { direction: 'horizontal', word: 'at', x: 0, y: 1 },
      { direction: 'vertical', word: 'cat', x: 1, y: 3 },
    ]);
  });
});

describe('Board.getCollidingWords', () => {
  const board = Board.fromStringArray(['     ', ' cat ', ' o  o', ' dot ', '     ']);

  it('finds the words crossing each cell of a horizontal word', () => {
    expect(board.getCollidingWords({ direction: 'horizontal', word: 'cat', x: 1, y: 1 })).toEqual([
      { direction: 'vertical', word: 'cod', x: 1, y: 1 },
    ]);
  });

  it('finds the words crossing each cell of a vertical word', () => {
    expect(board.getCollidingWords({ direction: 'vertical', word: 'cod', x: 1, y: 1 })).toEqual([
      { direction: 'horizontal', word: 'cat', x: 1, y: 1 },
      { direction: 'horizontal', word: 'dot', x: 1, y: 3 },
    ]);
  });

  it('finds a crossing word entered away from its start', () => {
    expect(board.getCollidingWords({ direction: 'horizontal', word: 'dot', x: 1, y: 3 })).toEqual([
      { direction: 'vertical', word: 'cod', x: 1, y: 1 },
    ]);
  });

  it('returns no words for a word without crossings', () => {
    const lonely = Board.fromStringArray(['     ', ' cat ', '     ', '     ', '     ']);

    expect(lonely.getCollidingWords({ direction: 'horizontal', word: 'cat', x: 1, y: 1 })).toEqual([]);
  });
});

describe('Board.create', () => {
  it('builds a board of the given width and height', () => {
    const board = Board.create(4, 2);

    expect(board.columnsCount).toBe(4);
    expect(board.rowsCount).toBe(2);
    expect(board.rows.map((row) => row.length)).toEqual([4, 4]);
  });

  it('leaves every cell empty, without a tile', () => {
    const board = Board.create(3, 2);

    expect(board.isEmpty()).toBe(true);
    expect(board.rows.flat().every((cell) => cell.tile === Tile.Null)).toBe(true);
  });

  it('numbers cells by column and row', () => {
    expect(Board.create(2, 2).rows.flat().map(locate)).toEqual(['0,0', '1,0', '0,1', '1,1']);
  });

  it('gives each row its own cells', () => {
    const board = Board.create(2, 2);

    board.updateCell(
      0,
      0,
      (cell) => new Cell({ isEmpty: false, tile: new Tile({ character: 'a' }), x: cell.x, y: cell.y }),
    );

    expect(board.rows[1][0].isEmpty).toBe(true);
  });
});

describe('Board.fromStringArray', () => {
  it('reads letters as filled cells and spaces as empty cells', () => {
    const board = Board.fromStringArray(['a ', ' b']);

    expect(board.rows.flat().map((cell) => cell.isFilled())).toEqual([true, false, false, true]);
    expect(board.rows[0][1].tile).toBe(Tile.Null);
  });

  it('reads letters as non-blank tiles', () => {
    expect(Board.fromStringArray(['a']).rows[0][0].tile.isBlank).toBe(false);
  });

  it('numbers cells by column and row on a non-square board', () => {
    expect(Board.fromStringArray(['abc', 'def']).rows.flat().map(locate)).toEqual([
      '0,0',
      '1,0',
      '2,0',
      '0,1',
      '1,1',
      '2,1',
    ]);
  });

  it('reads right-to-left letters and diacritics as single cells', () => {
    const board = Board.fromStringArray(['پا', 'łź']);

    expect(board.columnsCount).toBe(2);
    expect(board.rows[0].map(String)).toEqual(['پ', 'ا']);
    expect(board.rows[1].map(String)).toEqual(['ł', 'ź']);
  });
});

describe('Board.fromJson and toJson', () => {
  it('writes each cell', () => {
    const board = new Board({
      rows: [
        [
          new Cell({ isEmpty: false, tile: new Tile({ character: 'ch', isBlank: true }), x: 0, y: 0 }),
          new Cell({ x: 1, y: 0 }),
        ],
      ],
    });

    expect(board.toJson()).toStrictEqual([
      [
        { isEmpty: false, tile: { character: 'ch', isBlank: true }, x: 0, y: 0 },
        { isEmpty: true, tile: null, x: 1, y: 0 },
      ],
    ]);
  });

  it.each<[string, BoardJson]>([
    ['an empty board', Board.create(2, 2).toJson()],
    ['a non-square board', Board.fromStringArray(['abc', '   ']).toJson()],
    [
      'blanks, candidates and two-character tiles',
      [
        [
          { isEmpty: false, tile: { character: 'a', isBlank: true }, x: 0, y: 0 },
          { isEmpty: true, tile: { character: 'b', isBlank: false }, x: 1, y: 0 },
          { isEmpty: false, tile: { character: 'rr', isBlank: false }, x: 2, y: 0 },
        ],
      ],
    ],
  ])('round-trips %s exactly', (_name, json) => {
    expect(Board.fromJson(json).toJson()).toStrictEqual(json);
  });

  it('survives serialization to text', () => {
    const board = Board.fromStringArray(['ab ', '  c']);
    const decoded = Board.fromJson(JSON.parse(JSON.stringify(board.toJson())) as BoardJson);

    expect(decoded.equals(board)).toBe(true);
    expect(decoded.getTilesCount()).toBe(3);
  });
});

describe('Board.center', () => {
  it.each([
    ['an odd square', [15, 15], [7, 7]],
    ['an even square', [4, 4], [2, 2]],
    ['a wide board', [7, 2], [3, 1]],
    ['a tall board', [2, 7], [1, 3]],
    ['a single cell', [1, 1], [0, 0]],
  ])('finds the middle of %s', (_name, [width, height], [x, y]) => {
    const { center } = Board.create(width, height);

    expect(center.x).toBe(x);
    expect(center.y).toBe(y);
  });
});

describe('Board.clone', () => {
  it('copies the board', () => {
    const board = Board.fromStringArray(['ab', '  ']);

    expect(board.clone().equals(board)).toBe(true);
    expect(board.clone()).not.toBe(board);
  });

  it('keeps the dimensions', () => {
    const clone = Board.create(5, 3).clone();

    expect(clone.columnsCount).toBe(5);
    expect(clone.rowsCount).toBe(3);
  });

  it('leaves the original alone when a cell of the copy changes', () => {
    const board = Board.fromStringArray(['a']);
    const clone = board.clone();

    clone.updateCell(0, 0, () => new Cell({ x: 0, y: 0 }));

    expect(board.toString()).toBe('a');
  });

  it('leaves the original alone when a tile of the copy changes', () => {
    const board = Board.fromStringArray(['a']);

    board.clone().rows[0][0].tile.character = 'z';

    expect(board.toString()).toBe('a');
  });

  it('leaves the original alone when a row of the copy changes', () => {
    const board = Board.fromStringArray(['a']);
    const clone = board.clone();

    clone.updateRow(0, () => [new Cell({ x: 0, y: 0 })]);

    expect(board.toString()).toBe('a');
  });
});

describe('Board.equals', () => {
  const board = Board.fromStringArray(['ab', '  ']);

  it('accepts a board with the same cells', () => {
    expect(board.equals(Board.fromStringArray(['ab', '  ']))).toBe(true);
  });

  it('rejects a different tile', () => {
    expect(board.equals(Board.fromStringArray(['ac', '  ']))).toBe(false);
  });

  it('rejects a tile in another position', () => {
    expect(board.equals(Board.fromStringArray(['  ', 'ab']))).toBe(false);
  });

  it('rejects a different blank flag', () => {
    const other = board.clone();
    other.updateCell(0, 0, (cell) => withTile(cell, new Tile({ character: 'a', isBlank: true })));

    expect(board.equals(other)).toBe(false);
  });

  it('rejects a candidate in place of a tile', () => {
    const other = board.clone();
    other.updateCell(0, 0, (cell) => new Cell({ isEmpty: true, tile: cell.tile, x: cell.x, y: cell.y }));

    expect(board.equals(other)).toBe(false);
  });

  it('rejects a wider board', () => {
    expect(Board.create(2, 2).equals(Board.create(3, 2))).toBe(false);
    expect(Board.create(3, 2).equals(Board.create(2, 2))).toBe(false);
  });

  it('rejects a taller board', () => {
    expect(Board.create(2, 2).equals(Board.create(2, 3))).toBe(false);
    expect(Board.create(2, 3).equals(Board.create(2, 2))).toBe(false);
  });
});

describe('Board collision checks', () => {
  const surrounded = Board.fromStringArray(['   ', ' x ', '   ']);
  const full = Board.fromStringArray(['xxx', 'xxx', 'xxx']);

  it('sees a tile below', () => {
    expect(surrounded.collidesDown(surrounded.rows[0][1])).toBe(true);
    expect(surrounded.collidesUp(surrounded.rows[0][1])).toBe(false);
  });

  it('sees a tile above', () => {
    expect(surrounded.collidesUp(surrounded.rows[2][1])).toBe(true);
    expect(surrounded.collidesDown(surrounded.rows[2][1])).toBe(false);
  });

  it('sees a tile to the right', () => {
    expect(surrounded.collidesRight(surrounded.rows[1][0])).toBe(true);
    expect(surrounded.collidesLeft(surrounded.rows[1][0])).toBe(false);
  });

  it('sees a tile to the left', () => {
    expect(surrounded.collidesLeft(surrounded.rows[1][2])).toBe(true);
    expect(surrounded.collidesRight(surrounded.rows[1][2])).toBe(false);
  });

  it('does not look past the top-left corner', () => {
    expect(full.collidesUp(full.rows[0][0])).toBe(false);
    expect(full.collidesLeft(full.rows[0][0])).toBe(false);
  });

  it('does not look past the bottom-right corner', () => {
    expect(full.collidesDown(full.rows[2][2])).toBe(false);
    expect(full.collidesRight(full.rows[2][2])).toBe(false);
  });

  it('does not look past the bottom of a wide board', () => {
    const wide = Board.fromStringArray(['xxxx', 'xxxx']);

    expect(wide.collidesDown(wide.rows[1][3])).toBe(false);
    expect(wide.collidesRight(wide.rows[1][2])).toBe(true);
  });

  it('does not look past the right of a tall board', () => {
    const tall = Board.fromStringArray(['xx', 'xx', 'xx', 'xx']);

    expect(tall.collidesRight(tall.rows[3][1])).toBe(false);
    expect(tall.collidesDown(tall.rows[2][1])).toBe(true);
  });

  it('collides when any side touches a tile', () => {
    expect(surrounded.collides(surrounded.rows[0][1])).toBe(true);
    expect(surrounded.collides(surrounded.rows[2][1])).toBe(true);
    expect(surrounded.collides(surrounded.rows[1][0])).toBe(true);
    expect(surrounded.collides(surrounded.rows[1][2])).toBe(true);
  });

  it('does not collide diagonally', () => {
    expect(surrounded.collides(surrounded.rows[0][0])).toBe(false);
    expect(surrounded.collides(surrounded.rows[2][2])).toBe(false);
  });

  it('does not collide with a lone tile on a single cell board', () => {
    const single = Board.fromStringArray(['x']);

    expect(single.collides(single.rows[0][0])).toBe(false);
  });

  it('ignores a candidate tile beside the cell', () => {
    const board = Board.create(2, 1);
    board.updateCell(
      1,
      0,
      (cell) => new Cell({ isEmpty: true, tile: new Tile({ character: 'a' }), x: cell.x, y: cell.y }),
    );

    expect(board.collidesRight(board.rows[0][0])).toBe(false);
  });
});

describe('Board tile counts', () => {
  it('counts nothing on an empty board', () => {
    const board = Board.create(3, 3);

    expect(board.getTilesCount()).toBe(0);
    expect(board.getBlanksCount()).toBe(0);
    expect(board.isEmpty()).toBe(true);
  });

  it('counts tiles across all rows', () => {
    const board = Board.fromStringArray(['ab ', '  c', 'd  ']);

    expect(board.getTilesCount()).toBe(4);
    expect(board.getBlanksCount()).toBe(0);
    expect(board.isEmpty()).toBe(false);
  });

  it('counts a blank as a tile and as a blank', () => {
    const board = Board.fromStringArray(['ab', ' c']);
    board.updateCell(1, 0, (cell) => withTile(cell, new Tile({ character: 'b', isBlank: true })));
    board.updateCell(1, 1, (cell) => withTile(cell, new Tile({ character: 'c', isBlank: true })));

    expect(board.getTilesCount()).toBe(3);
    expect(board.getBlanksCount()).toBe(2);
  });

  it('counts a two-character tile once', () => {
    const board = Board.create(2, 1);
    board.updateCell(
      0,
      0,
      (cell) => new Cell({ isEmpty: false, tile: new Tile({ character: 'ch' }), x: cell.x, y: cell.y }),
    );

    expect(board.getTilesCount()).toBe(1);
  });

  it('counts a candidate as a tile, while the board still reads as empty', () => {
    const board = Board.create(2, 1);
    board.updateCell(
      0,
      0,
      (cell) => new Cell({ isEmpty: true, tile: new Tile({ character: 'a' }), x: cell.x, y: cell.y }),
    );

    expect(board.getTilesCount()).toBe(1);
    expect(board.isEmpty()).toBe(true);
  });

  it('is not empty when only the last cell holds a tile', () => {
    expect(Board.fromStringArray(['   ', '  a']).isEmpty()).toBe(false);
  });
});

describe('Board.getRow and getColumn', () => {
  const board = Board.fromStringArray(['abc', 'def']);

  it('reads a row left to right', () => {
    expect(board.getRow(1).map(String)).toEqual(['d', 'e', 'f']);
  });

  it('reads a column top to bottom', () => {
    expect(board.getColumn(2).map(String)).toEqual(['c', 'f']);
  });

  it('gives a row the width of the board and a column its height', () => {
    expect(board.getRow(0)).toHaveLength(3);
    expect(board.getColumn(0)).toHaveLength(2);
  });
});

describe('Board.toString', () => {
  it('prints rows on separate lines, keeping spaces for empty cells', () => {
    expect(Board.fromStringArray(['ab ', ' c ']).toString()).toBe('ab \n c ');
  });

  it('prints text that reads back as the same board', () => {
    const board = Board.fromStringArray(['ab ', ' c ']);

    expect(Board.fromStringArray(board.toString().split('\n')).equals(board)).toBe(true);
  });
});

describe('Board.updateCell', () => {
  it('replaces one cell with what the updater returns', () => {
    const board = Board.fromStringArray(['ab', 'cd']);
    const replacement = new Cell({ isEmpty: false, tile: new Tile({ character: 'z' }), x: 1, y: 0 });

    board.updateCell(1, 0, () => replacement);

    expect(board.rows[0][1]).toBe(replacement);
    expect(board.toString()).toBe('az\ncd');
  });

  it('passes the current cell to the updater', () => {
    const board = Board.fromStringArray(['ab', 'cd']);
    let received: Cell | undefined;

    board.updateCell(0, 1, (cell) => {
      received = cell;
      return cell;
    });

    expect(received).toBe(board.rows[1][0]);
  });
});

describe('Board.updateRow', () => {
  it('replaces one row with what the updater returns', () => {
    const board = Board.fromStringArray(['ab', 'cd']);

    board.updateRow(1, (cells) => [...cells].reverse());

    expect(board.toString()).toBe('ab\ndc');
  });
});

function withTile({ isEmpty, x, y }: Cell, tile: Tile): Cell {
  return new Cell({ isEmpty, tile, x, y });
}

function locate({ x, y }: Cell): string {
  return `${x},${y}`;
}
