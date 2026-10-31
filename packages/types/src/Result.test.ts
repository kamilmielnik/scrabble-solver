/* eslint-disable max-lines */
import { describe, expect, it } from 'bun:test';

import { Board } from './Board';
import { Cell } from './Cell';
import { Locale } from './Locale';
import { Result } from './Result';
import { type ResultJson } from './ResultJson';
import { Tile } from './Tile';

const LOCALE = Locale.EN_US;
const EMPTY_ROWS = ['     ', '     ', '     ', '     ', '     '];

describe('Result', () => {
  describe('fromJson and toJson', () => {
    it.each<[string, string[], ResultJson]>([
      ['a horizontal word on an empty board', EMPTY_ROWS, createJson({ tiles: ['a', 'b', 'c'], x: 1, y: 2 })],
      [
        'a vertical word on an empty board',
        EMPTY_ROWS,
        createJson({ isHorizontal: false, tiles: ['a', 'b', 'c'], x: 2, y: 1 }),
      ],
      [
        'a word played between board tiles',
        ['     ', '     ', ' a c ', '     ', '     '],
        createJson({ id: 7, points: 12, tiles: ['b'], x: 1, y: 2 }),
      ],
      [
        'a vertical word played between board tiles',
        ['     ', '  a  ', '     ', '  c  ', '     '],
        createJson({ isHorizontal: false, tiles: ['b'], x: 2, y: 1 }),
      ],
      [
        'a word extending a board tile on both sides',
        ['     ', '     ', '  b  ', '     ', '     '],
        createJson({ tiles: ['a', 'c'], x: 1, y: 2 }),
      ],
      [
        'blanks, indexed among placed tiles only',
        ['     ', '     ', ' a c ', '     ', '     '],
        createJson({ blankIndices: [0, 1], tiles: ['b', 'd'], x: 1, y: 2 }),
      ],
      ['a trailing blank', EMPTY_ROWS, createJson({ blankIndices: [2], tiles: ['a', 'b', 'c'], x: 0, y: 0 })],
      ['a two-character tile', EMPTY_ROWS, createJson({ tiles: ['ch', 'a'], x: 0, y: 0 })],
      ['a word ending at the right edge', EMPTY_ROWS, createJson({ tiles: ['a', 'b'], x: 3, y: 4 })],
      [
        'a word ending at the bottom edge',
        EMPTY_ROWS,
        createJson({ isHorizontal: false, tiles: ['a', 'b'], x: 4, y: 3 }),
      ],
      [
        'a word filling a whole row of a wide board',
        ['       ', '       '],
        createJson({ tiles: ['a', 'b', 'c', 'd', 'e', 'f', 'g'], x: 0, y: 1 }),
      ],
      [
        'a word filling a whole column of a tall board',
        ['  ', '  ', '  ', '  ', '  ', '  '],
        createJson({ isHorizontal: false, tiles: ['a', 'b', 'c', 'd', 'e', 'f'], x: 1, y: 0 }),
      ],
    ])('round-trips %s exactly', (_name, rows, json) => {
      expect(Result.fromJson(json, Board.fromStringArray(rows), LOCALE).toJson()).toStrictEqual(json);
    });

    it('rebuilds an equal result from serialized text', () => {
      const board = Board.fromStringArray(['     ', '     ', ' a c ', '     ', '     ']);
      const result = Result.fromJson(
        createJson({ blankIndices: [0], points: 3, tiles: ['b'], x: 1, y: 2 }),
        board,
        LOCALE,
      );
      const decoded = Result.fromJson(JSON.parse(JSON.stringify(result.toJson())) as ResultJson, board, LOCALE);

      expect(decoded.toJson()).toStrictEqual(result.toJson());
      expect(decoded.word).toBe('abc');
    });

    it('rebuilds the cells of the word, board tiles included', () => {
      const result = createResult(['     ', '     ', ' a c ', '     ', '     '], { tiles: ['b'], x: 1, y: 2 });

      expect(result.cells.map(String)).toEqual(['a', 'b', 'c']);
      expect(result.cells.map(({ isEmpty }) => isEmpty)).toEqual([false, true, false]);
      expect(result.cells.map(({ x, y }) => [x, y])).toEqual([
        [1, 2],
        [2, 2],
        [3, 2],
      ]);
    });

    it('copies the id and the points', () => {
      const result = createResult(EMPTY_ROWS, { id: 42, points: 17, tiles: ['a', 'b'] });

      expect(result.id).toBe(42);
      expect(result.points).toBe(17);
    });

    it('leaves the board untouched when the result cells change', () => {
      const board = Board.fromStringArray(['     ', '     ', ' a   ', '     ', '     ']);
      const result = Result.fromJson(createJson({ tiles: ['b'], x: 1, y: 2 }), board, LOCALE);

      result.cells[0].tile.character = 'z';

      expect(board.rows[2][1].tile.character).toBe('a');
    });
  });

  describe('counts', () => {
    it('separates the cells of the word from the tiles placed for it', () => {
      const result = createResult(['     ', '     ', ' a c ', '     ', '     '], { tiles: ['b'], x: 1, y: 2 });

      expect(result.length).toBe(3);
      expect(result.tilesCount).toBe(1);
      expect(result.tiles.map(String)).toEqual(['b']);
    });

    it('counts a two-character tile as one cell and one tile', () => {
      const result = createResult(EMPTY_ROWS, { tiles: ['ch', 'a'] });

      expect(result.word).toBe('cha');
      expect(result.length).toBe(2);
      expect(result.tilesCount).toBe(2);
    });

    it('counts placed blanks and ignores blanks already on the board', () => {
      const board = Board.create(5, 5);
      board.updateCell(1, 2, () => {
        return new Cell({ isEmpty: false, tile: new Tile({ character: 'a', isBlank: true }), x: 1, y: 2 });
      });
      const result = Result.fromJson(createJson({ blankIndices: [1], tiles: ['b', 'c'], x: 1, y: 2 }), board, LOCALE);

      expect(result.word).toBe('abc');
      expect(result.blanksCount).toBe(1);
    });

    it('counts no blanks when none were placed', () => {
      expect(createResult(EMPTY_ROWS, { tiles: ['a', 'b'] }).blanksCount).toBe(0);
    });

    it('counts only placed tiles as vowels and consonants', () => {
      const result = createResult(['     ', '     ', ' a b ', '     ', '     '], { tiles: ['e', 'c'], x: 1, y: 2 });

      expect(result.word).toBe('aebc');
      expect(result.vowelsCount).toBe(1);
      expect(result.consonantsCount).toBe(1);
    });

    it('leaves blanks out of consonants', () => {
      const result = createResult(EMPTY_ROWS, { blankIndices: [0], tiles: ['b', 'c', 'a'] });

      expect(result.consonantsCount).toBe(1);
      expect(result.vowelsCount).toBe(1);
      expect(result.blanksCount).toBe(1);
    });

    it('leaves blanks out of vowels', () => {
      const result = createResult(EMPTY_ROWS, { blankIndices: [2], tiles: ['b', 'c', 'a'] });

      expect(result.consonantsCount).toBe(2);
      expect(result.vowelsCount).toBe(0);
      expect(result.blanksCount).toBe(1);
    });

    it.each([
      ['a Polish vowel', 'ą', 0, 1],
      ['a Polish consonant', 'ł', 1, 0],
      ['the Turkish dotless i', 'ı', 0, 1],
      ['a Turkish consonant', 'ş', 1, 0],
      ['a Spanish consonant', 'ñ', 1, 0],
      ['a German vowel', 'ü', 0, 1],
      ['a Persian letter, for which the app hides both columns', 'پ', 0, 0],
      ['a two-character tile, which the app groups apart from both', 'ch', 0, 0],
    ])('classifies %s', (_name, character, consonantsCount, vowelsCount) => {
      const result = createResult(EMPTY_ROWS, { tiles: [character] });

      expect(result.consonantsCount).toBe(consonantsCount);
      expect(result.vowelsCount).toBe(vowelsCount);
    });

    it('counts y by the rules of the locale', () => {
      const json = createJson({ tiles: ['y', 'a'] });
      const board = Board.fromStringArray(EMPTY_ROWS);
      const english = Result.fromJson(json, board, Locale.EN_US);
      const turkish = Result.fromJson(json, board, Locale.TR_TR);

      expect([english.consonantsCount, english.vowelsCount]).toEqual([0, 2]);
      expect([turkish.consonantsCount, turkish.vowelsCount]).toEqual([1, 1]);
    });
  });

  describe('pointsRatio', () => {
    it('divides the points by the tiles placed, not by the word length', () => {
      const result = createResult(['     ', '     ', 'a    ', '     ', '     '], {
        points: 10,
        tiles: ['b', 'c', 'd', 'e'],
        x: 0,
        y: 2,
      });

      expect(result.length).toBe(5);
      expect(result.pointsRatio).toBe(2.5);
    });

    it('counts a blank as a placed tile', () => {
      expect(createResult(EMPTY_ROWS, { blankIndices: [1], points: 3, tiles: ['a', 'b'] }).pointsRatio).toBe(1.5);
    });

    it('is zero for a word worth nothing', () => {
      expect(createResult(EMPTY_ROWS, { points: 0, tiles: ['a', 'b'] }).pointsRatio).toBe(0);
    });
  });

  describe('direction', () => {
    it('recognizes a horizontal word', () => {
      const result = createResult(EMPTY_ROWS, { tiles: ['a', 'b'], x: 1, y: 2 });

      expect(result.isHorizontal()).toBe(true);
      expect(result.isVertical()).toBe(false);
    });

    it('recognizes a vertical word', () => {
      const result = createResult(EMPTY_ROWS, { isHorizontal: false, tiles: ['a', 'b'], x: 1, y: 2 });

      expect(result.isHorizontal()).toBe(false);
      expect(result.isVertical()).toBe(true);
    });
  });

  describe('collisions', () => {
    it('has a single word when nothing is crossed', () => {
      const result = createResult(EMPTY_ROWS, { tiles: ['a', 'b'] });

      expect(result.collisions).toEqual([]);
      expect(result.words).toEqual(['ab']);
      expect(result.wordsCount).toBe(1);
    });

    it('lists the perpendicular word after the main word', () => {
      const result = createResult(['  a  ', '     ', '  c  ', '     ', '     '], {
        tiles: ['x', 'b', 'y'],
        x: 1,
        y: 1,
      });

      expect(result.words).toEqual(['xby', 'abc']);
      expect(result.collisions.map((collision) => collision.map(String).join(''))).toEqual(['abc']);
      expect(result.wordsCount).toBe(2);
    });

    it('lists a horizontal collision of a vertical word', () => {
      const result = createResult(['     ', '     ', 'a c  ', '     ', '     '], {
        isHorizontal: false,
        tiles: ['x', 'b', 'y'],
        x: 1,
        y: 1,
      });

      expect(result.words).toEqual(['xby', 'abc']);
    });

    it('counts every crossing, in reading order', () => {
      const result = createResult(['a   e', '     ', '     ', '     ', '     '], {
        tiles: ['b', 'c', 'd', 'f', 'g'],
        x: 0,
        y: 1,
      });

      expect(result.words).toEqual(['bcdfg', 'ab', 'eg']);
      expect(result.wordsCount).toBe(3);
    });

    it('does not count crossings of tiles that were already on the board', () => {
      const result = createResult(['  z  ', ' xa  ', '     ', '     ', '     '], {
        isHorizontal: false,
        tiles: ['b'],
        x: 2,
        y: 0,
      });

      expect(result.word).toBe('zab');
      expect(result.collisions).toEqual([]);
    });
  });

  it('can be built directly from cells', () => {
    const cells = [
      new Cell({ isEmpty: false, tile: new Tile({ character: 'a' }), x: 0, y: 0 }),
      new Cell({ tile: new Tile({ character: 'b' }), x: 1, y: 0 }),
    ];
    const collision = [
      new Cell({ tile: new Tile({ character: 'b' }), x: 1, y: 0 }),
      new Cell({ isEmpty: false, tile: new Tile({ character: 'c' }), x: 1, y: 1 }),
    ];
    const result = new Result({ cells, collisions: [collision], id: 1, locale: LOCALE, points: 4 });

    expect(result.cells).toBe(cells);
    expect(result.collisions).toEqual([collision]);
    expect(result.words).toEqual(['ab', 'bc']);
    expect(result.wordsCount).toBe(2);
    expect(result.pointsRatio).toBe(4);
  });
});

function createResult(rows: string[], overrides: Partial<ResultJson>): Result {
  return Result.fromJson(createJson(overrides), Board.fromStringArray(rows), LOCALE);
}

function createJson(overrides: Partial<ResultJson>): ResultJson {
  return { blankIndices: [], id: 0, isHorizontal: true, points: 0, tiles: [], x: 0, y: 0, ...overrides };
}
