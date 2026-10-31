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
      nextPosition: { x: 1, y: 0 },
      target: { x: 0, y: 0 },
      value: 'tlh',
    });
  });

  it('joins a shorter digraph on the board with a character', () => {
    expect(joinTiles(klingon, ['tl', ' '], 1, 'h')).toEqual({
      clearedCells: [],
      nextPosition: { x: 1, y: 0 },
      target: { x: 0, y: 0 },
      value: 'tlh',
    });
  });

  it('leaves the tile on the position when joining the tiles before it', () => {
    expect(join(spanish, 'ca', 1, 'h')).toEqual({
      clearedCells: [],
      nextPosition: { x: 1, y: 0 },
      target: { x: 0, y: 0 },
      value: 'ch',
    });
  });

  it('splits the following tiles, which are typed again in the next steps', () => {
    expect(join(catalan, '.·l', 0, 'l')).toEqual({
      clearedCells: [
        { x: 1, y: 0 },
        { x: 2, y: 0 },
      ],
      nextPosition: { x: 1, y: 0 },
      target: { x: 0, y: 0 },
      value: 'l',
    });
  });

  it('joins the tiles on both sides of the position', () => {
    expect(join(catalan, 'l.l', 1, '·')).toEqual({
      clearedCells: [
        { x: 1, y: 0 },
        { x: 2, y: 0 },
      ],
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
      nextPosition: { x: 0, y: 2 },
      target: { x: 0, y: 0 },
      value: 'l·l',
    });
  });

  it('prefers the shorter run of tiles before the position', () => {
    expect(join(klingon, 'ttl.', 3, 'h')?.target).toEqual({ x: 1, y: 0 });
  });

  it('joins inside the last cell of a line', () => {
    expect(join(spanish, '.c', 1, 'h')).toEqual({
      clearedCells: [],
      nextPosition: { x: 1, y: 0 },
      target: { x: 1, y: 0 },
      value: 'ch',
    });
  });

  it('joins the tiles before the last cell with the last cell', () => {
    expect(join(catalan, 'l·', 1, 'l')).toEqual({
      clearedCells: [{ x: 1, y: 0 }],
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

  it('does not join a blank', () => {
    const board = createRow(['l', '·', ' ']);
    board.rows[0][0].tile.isBlank = true;

    expect(
      findDigraphJoin({ board, character: 'l', config: catalan, direction: 'horizontal', position: { x: 2, y: 0 } }),
    ).toBeUndefined();
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
