import { type Board, type Config } from '@scrabble-solver/types';

import { type Direction, type Point } from '@/types';

const AXES: Direction[] = ['vertical', 'horizontal'];

interface Options {
  board: Board;
  character: string;
  config: Config;
  direction: Direction;
  position: Point;
}

interface Span {
  first: number;
  last: number;
}

interface DigraphJoin {
  clearedCells: Point[];
  nextPosition: Point;
  target: Point;
  value: string;
}

/**
 * Finds what typing a character next to the tiles that spell a digraph with it does to the board.
 */
export function findDigraphJoin(options: Options): DigraphJoin | undefined {
  for (const axis of AXES) {
    const join = findJoinAround(options, axis);

    if (join) {
      return join;
    }
  }

  for (const axis of AXES) {
    const join = isLastOnAxis(options, axis) ? findJoinInLastCell(options, axis) : undefined;

    if (join) {
      return join;
    }
  }

  return undefined;
}

/**
 * Not every character of a digraph is a tile: Catalan has no "q" or "·" tiles.
 * Such a character has to stay on the board until the character that completes the digraph arrives.
 */
export function continuesDigraph(options: Omit<Options, 'direction'>): boolean {
  const { character, config } = options;

  return AXES.some((axis) => {
    const tiles = readTiles(options, axis, -1);

    return Array.from({ length: tiles.length + 1 }).some((_, count) => {
      return config.isDigraphPrefix(spell(tiles.slice(0, count).reverse(), character));
    });
  });
}

function findJoinAround(options: Options, axis: Direction): DigraphJoin | undefined {
  const { character, config } = options;
  const tilesBefore = readTiles(options, axis, -1);
  const tilesAfter = readTiles(options, axis, 1);

  for (let countAfter = 0; countAfter <= tilesAfter.length; ++countAfter) {
    for (let countBefore = 0; countBefore <= tilesBefore.length; ++countBefore) {
      const before = tilesBefore.slice(0, countBefore).reverse();
      const after = tilesAfter.slice(0, countAfter);
      const value = spell(before, character, after);

      if (countBefore + countAfter === 0 || !config.digraphs.includes(value)) {
        continue;
      }

      if (countBefore === 0) {
        return createJoinOfFollowingTiles(options, axis, countAfter);
      }

      return createJoin(options, axis, value, { first: -countBefore, last: countAfter === 0 ? -1 : countAfter });
    }
  }

  return undefined;
}

/**
 * Focus cannot leave the last cell, so the next character arrives in the cell that holds the previous one.
 */
function findJoinInLastCell(options: Options, axis: Direction): DigraphJoin | undefined {
  const { board, character, config, position } = options;
  const lastTile = readTile(board, position);

  if (typeof lastTile === 'undefined') {
    return undefined;
  }

  const tiles = [lastTile, ...readTiles(options, axis, -1)];

  for (let count = 1; count <= tiles.length; ++count) {
    const value = spell(tiles.slice(0, count).reverse(), character);

    if (config.digraphs.includes(value)) {
      return createJoin(options, axis, value, { first: 1 - count, last: 0 });
    }
  }

  return undefined;
}

function createJoin({ direction, position }: Options, axis: Direction, value: string, span: Span): DigraphJoin {
  const offsets = Array.from({ length: span.last - span.first }, (_, index) => span.first + 1 + index);

  return {
    clearedCells: offsets.map((offset) => movePoint(position, axis, offset)),
    nextPosition: axis === direction && span.first < 0 ? movePoint(position, axis, span.first + 1) : position,
    target: movePoint(position, axis, span.first),
    value,
  };
}

function createJoinOfFollowingTiles(
  { character, direction, position }: Options,
  axis: Direction,
  count: number,
): DigraphJoin {
  return {
    clearedCells: Array.from({ length: count }, (_, index) => movePoint(position, axis, index + 1)),
    nextPosition: movePoint(position, direction, 1),
    target: position,
    value: character,
  };
}

function readTiles({ board, config, position }: Omit<Options, 'direction'>, axis: Direction, step: number): string[] {
  const tiles: string[] = [];

  while (tiles.length + 1 < config.longestDigraphLength) {
    const tile = readTile(board, movePoint(position, axis, step * (tiles.length + 1)));

    if (typeof tile === 'undefined') {
      return tiles;
    }

    tiles.push(tile);
  }

  return tiles;
}

function readTile(board: Board, { x, y }: Point): string | undefined {
  const cell = board.rows[y]?.[x];
  return cell?.hasTile() && !cell.tile.isBlank ? cell.tile.character : undefined;
}

function isLastOnAxis({ board, position }: Options, axis: Direction): boolean {
  return axis === 'horizontal' ? position.x + 1 >= board.columnsCount : position.y + 1 >= board.rowsCount;
}

function movePoint({ x, y }: Point, axis: Direction, offset: number): Point {
  return axis === 'horizontal' ? { x: x + offset, y } : { x, y: y + offset };
}

function spell(before: string[], character: string, after: string[] = []): string {
  return [...before, character, ...after].join('');
}
