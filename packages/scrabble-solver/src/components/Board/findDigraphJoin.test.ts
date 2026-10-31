/* eslint-disable max-lines */

import { getConfig } from '@scrabble-solver/configs';
import { Board, Cell, Config, Game, Locale, Tile } from '@scrabble-solver/types';

import { continuesDigraph, findDigraphJoin } from './findDigraphJoin';

const catalan = getConfig(Game.Scrabble, Locale.CA_ES);
const spanish = getConfig(Game.Scrabble, Locale.ES_ES);
const klingon = new Config({
  ...catalan.toJson(),
  tiles: ['a', 'h', 'l', 't', 'tl', 'tlh'].map((character) => ({ character, score: 1 })),
});

describe('findDigraphJoin', () => {
  it('finds nothing when the character spells no digraph', () => {
    expect(join(catalan, 'a..', 1, 'a')).toBeUndefined();
    expect(join(catalan, '...', 1, 'l')).toBeUndefined();
  });

  it('finds nothing in a language without digraphs', () => {
    expect(join(getConfig(Game.Scrabble, Locale.EN_US), 'c..', 1, 'h')).toBeUndefined();
  });

  it('joins the tiles before the position into the first of them', () => {
    expect(join(klingon, 'tl..', 2, 'h')).toEqual({
      clearedCells: [{ x: 1, y: 0 }],
      isBlank: false,
      nextPosition: { x: 1, y: 0 },
      target: { x: 0, y: 0 },
      value: 'tlh',
    });
  });

  it('joins a shorter digraph on the board with a character', () => {
    expect(joinTiles(klingon, ['tl', ' '], 1, 'h')).toEqual({
      clearedCells: [],
      isBlank: false,
      nextPosition: { x: 1, y: 0 },
      target: { x: 0, y: 0 },
      value: 'tlh',
    });
  });

  it('leaves the tile on the position when joining the tiles before it', () => {
    expect(join(spanish, 'ca', 1, 'h')).toEqual({
      clearedCells: [],
      isBlank: false,
      nextPosition: { x: 1, y: 0 },
      target: { x: 0, y: 0 },
      value: 'ch',
    });
  });

  it('joins the following tiles into the position', () => {
    expect(join(catalan, '.·l', 0, 'l')).toEqual({
      clearedCells: [
        { x: 1, y: 0 },
        { x: 2, y: 0 },
      ],
      isBlank: false,
      nextPosition: { x: 1, y: 0 },
      target: { x: 0, y: 0 },
      value: 'l·l',
    });
  });

  it('joins the tiles on both sides of the position', () => {
    expect(join(catalan, 'l.l', 1, '·')).toEqual({
      clearedCells: [
        { x: 1, y: 0 },
        { x: 2, y: 0 },
      ],
      isBlank: false,
      nextPosition: { x: 1, y: 0 },
      target: { x: 0, y: 0 },
      value: 'l·l',
    });
  });

  it('keeps the position when joining across the typing direction', () => {
    const board = createColumn(['l', '·', ' ']);

    expect(
      findDigraphJoin({ board, character: 'l', config: catalan, direction: 'horizontal', position: { x: 0, y: 2 } }),
    ).toEqual({
      clearedCells: [{ x: 0, y: 1 }],
      isBlank: false,
      nextPosition: { x: 0, y: 2 },
      target: { x: 0, y: 0 },
      value: 'l·l',
    });
  });

  it('prefers joining along the typing direction', () => {
    const board = new Board({
      rows: [
        [createCell(' ', 0, 0), createCell('c', 1, 0)],
        [createCell('c', 0, 1), createCell(' ', 1, 1)],
      ],
    });

    expect(
      findDigraphJoin({ board, character: 'h', config: spanish, direction: 'horizontal', position: { x: 1, y: 1 } }),
    ).toEqual({
      clearedCells: [],
      isBlank: false,
      nextPosition: { x: 1, y: 1 },
      target: { x: 0, y: 1 },
      value: 'ch',
    });
  });

  it('joins the following tiles across the typing direction when the typing direction spells no digraph', () => {
    const board = new Board({
      rows: [
        [createCell(' ', 0, 0), createCell(' ', 1, 0)],
        [createCell('u', 0, 1), createCell(' ', 1, 1)],
      ],
    });

    expect(
      findDigraphJoin({ board, character: 'q', config: catalan, direction: 'horizontal', position: { x: 0, y: 0 } }),
    ).toEqual({
      clearedCells: [{ x: 0, y: 1 }],
      isBlank: false,
      nextPosition: { x: 1, y: 0 },
      target: { x: 0, y: 0 },
      value: 'qu',
    });
  });

  it('prefers joining the following tiles along the typing direction', () => {
    const board = new Board({
      rows: [
        [createCell(' ', 0, 0), createCell('h', 1, 0)],
        [createCell('h', 0, 1), createCell(' ', 1, 1)],
      ],
    });

    expect(
      findDigraphJoin({ board, character: 'c', config: spanish, direction: 'horizontal', position: { x: 0, y: 0 } }),
    ).toEqual({
      clearedCells: [{ x: 1, y: 0 }],
      isBlank: false,
      nextPosition: { x: 1, y: 0 },
      target: { x: 0, y: 0 },
      value: 'ch',
    });
  });

  it('prefers joining inside the last cell of the typing direction', () => {
    const board = new Board({
      rows: [
        [createCell(' ', 0, 0), createCell('c', 1, 0)],
        [createCell(' ', 0, 1), createCell('c', 1, 1)],
      ],
    });

    expect(
      findDigraphJoin({ board, character: 'h', config: spanish, direction: 'horizontal', position: { x: 1, y: 1 } }),
    ).toEqual({ clearedCells: [], isBlank: false, nextPosition: { x: 1, y: 1 }, target: { x: 1, y: 1 }, value: 'ch' });
  });

  it('does not join inside the last cell across the typing direction', () => {
    const board = createRow(['c', ' ']);

    expect(
      findDigraphJoin({ board, character: 'h', config: spanish, direction: 'vertical', position: { x: 0, y: 0 } }),
    ).toEqual({ clearedCells: [], isBlank: false, nextPosition: { x: 0, y: 0 }, target: { x: 0, y: 0 }, value: 'ch' });
    expect(
      findDigraphJoin({ board, character: 'h', config: spanish, direction: 'horizontal', position: { x: 0, y: 0 } }),
    ).toBeUndefined();
  });

  it('prefers the shorter run of tiles before the position', () => {
    expect(join(klingon, 'ttl.', 3, 'h')?.target).toEqual({ x: 1, y: 0 });
  });

  it('joins inside the last cell of a line', () => {
    expect(join(spanish, '.c', 1, 'h')).toEqual({
      clearedCells: [],
      isBlank: false,
      nextPosition: { x: 1, y: 0 },
      target: { x: 1, y: 0 },
      value: 'ch',
    });
  });

  it('joins the tiles before the last cell with the last cell', () => {
    expect(join(catalan, 'l·', 1, 'l')).toEqual({
      clearedCells: [{ x: 1, y: 0 }],
      isBlank: false,
      nextPosition: { x: 1, y: 0 },
      target: { x: 0, y: 0 },
      value: 'l·l',
    });
  });

  it('does not join inside a cell that is not the last one', () => {
    const board = new Board({
      rows: [
        [createCell('c', 0, 0), createCell(' ', 1, 0)],
        [createCell(' ', 0, 1), createCell(' ', 1, 1)],
      ],
    });

    expect(
      findDigraphJoin({ board, character: 'h', config: spanish, direction: 'horizontal', position: { x: 0, y: 0 } }),
    ).toBeUndefined();
  });

  describe('blanks', () => {
    it('joins a blank into a blank digraph', () => {
      const board = createRow(['c', ' ', ' ']);
      board.rows[0][0].tile.isBlank = true;

      expect(
        findDigraphJoin({ board, character: 'h', config: spanish, direction: 'horizontal', position: { x: 1, y: 0 } }),
      ).toEqual({ clearedCells: [], isBlank: true, nextPosition: { x: 1, y: 0 }, target: { x: 0, y: 0 }, value: 'ch' });
    });

    it('joins a following blank into a blank digraph', () => {
      const board = createRow([' ', 'h', ' ']);
      board.rows[0][1].tile.isBlank = true;

      expect(join(spanish, '.h.', 0, 'c')?.isBlank).toBe(false);
      expect(
        findDigraphJoin({ board, character: 'c', config: spanish, direction: 'horizontal', position: { x: 0, y: 0 } }),
      ).toEqual({
        clearedCells: [{ x: 1, y: 0 }],
        isBlank: true,
        nextPosition: { x: 1, y: 0 },
        target: { x: 0, y: 0 },
        value: 'ch',
      });
    });
  });
});

describe('continuesDigraph', () => {
  it('accepts a character that starts a digraph', () => {
    expect(continues(catalan, '..', 0, 'q')).toBe(true);
  });

  it('accepts a character that continues the tiles before it', () => {
    expect(continues(catalan, 'l.', 1, '·')).toBe(true);
    expect(continues(klingon, 'tl..', 2, 'h')).toBe(false);
  });

  it('rejects a character that continues nothing', () => {
    expect(continues(catalan, '..', 0, '·')).toBe(false);
    expect(continues(catalan, 'a.', 1, '·')).toBe(false);
    expect(continues(catalan, '..', 0, 'y')).toBe(false);
  });

  it('looks for the tiles above as well', () => {
    const board = createColumn(['l', ' ']);

    expect(continuesDigraph({ board, character: '·', config: catalan, position: { x: 0, y: 1 } })).toBe(true);
  });
});

function join(config: Config, row: string, x: number, character: string) {
  return joinTiles(config, spreadRow(row), x, character);
}

function joinTiles(config: Config, tiles: string[], x: number, character: string) {
  const position = { x, y: 0 };

  return findDigraphJoin({ board: createRow(tiles), character, config, direction: 'horizontal', position });
}

function continues(config: Config, row: string, x: number, character: string): boolean {
  return continuesDigraph({ board: createRow(spreadRow(row)), character, config, position: { x, y: 0 } });
}

function spreadRow(row: string): string[] {
  return Array.from(row, (character) => (character === '.' ? ' ' : character));
}

function createRow(tiles: string[]): Board {
  return new Board({ rows: [tiles.map((character, x) => createCell(character, x, 0))] });
}

function createColumn(tiles: string[]): Board {
  return new Board({ rows: tiles.map((character, y) => [createCell(character, 0, y)]) });
}

function createCell(character: string, x: number, y: number): Cell {
  const isEmpty = character === ' ';

  return new Cell({ isEmpty, tile: isEmpty ? Tile.Null : new Tile({ character }), x, y });
}
