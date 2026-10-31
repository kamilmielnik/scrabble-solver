import { type Board, type Config, type Tile } from '@scrabble-solver/types';

import { type Direction, type Point } from '@/types';

import { toggleDirection } from './lib';

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

interface Candidate {
  joinedTiles: Tile[];
  value: string;
}

interface DigraphJoin {
  clearedCells: Point[];
  isBlank: boolean;
  nextPosition: Point;
  target: Point;
  value: string;
}

/**
 * Finds what typing a character next to the tiles that spell a digraph with it does to the board.
 * A digraph joined from a blank, or typed over one, is a blank.
 */
export function findDigraphJoin(options: Options): DigraphJoin | undefined {
  const { direction } = options;

  return (
    findJoinAround(options, direction) ??
    findJoinInLastCell(options) ??
    findJoinAround(options, toggleDirection(direction))
  );
}

/**
 * Not every character of a digraph is a tile: Catalan has no "q" or "·" tiles.
 * Such a character has to stay on the board until the character that completes the digraph arrives,
 * which happens next to it in the typing direction.
 */
export function continuesDigraph(options: Options): boolean {
  const { character, config, direction } = options;
  const tiles = readTiles(options, direction, -1);

  return Array.from({ length: tiles.length + 1 }).some((_, count) => {
    return config.isDigraphPrefix(spell(tiles.slice(0, count).reverse(), character));
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

      const span = { first: -countBefore, last: countAfter === 0 ? -1 : countAfter };
      return createJoin(options, axis, span, { joinedTiles: [...before, ...after], value });
    }
  }

  return undefined;
}

/**
 * Focus cannot leave the last cell, so the next character arrives in the cell that holds the previous one.
 * That cell keeps the beginning of a digraph until the character that completes it arrives.
 */
function findJoinInLastCell(options: Options): DigraphJoin | undefined {
  const { board, character, config, direction, position } = options;
  const lastTile = readTile(board, position);

  if (!isLastCell(options) || typeof lastTile === 'undefined') {
    return undefined;
  }

  const tiles = [lastTile, ...readTiles(options, direction, -1)];
  const candidates = tiles.map((_, index): Candidate => {
    const joinedTiles = tiles.slice(0, index + 1).reverse();
    return { joinedTiles, value: spell(joinedTiles, character) };
  });
  const join =
    candidates.find(({ value }) => config.digraphs.includes(value)) ??
    candidates.find(({ value }) => config.isDigraphPrefix(value));

  if (typeof join === 'undefined') {
    return undefined;
  }

  return createJoin(options, direction, { first: 1 - join.joinedTiles.length, last: 0 }, join);
}

function createJoin(options: Options, axis: Direction, span: Span, { joinedTiles, value }: Candidate): DigraphJoin {
  const { board, position } = options;
  const offsets = Array.from({ length: span.last - span.first }, (_, index) => span.first + 1 + index);
  const target = movePoint(position, axis, span.first);
  const replacedTile = isSamePoint(target, position) ? readTile(board, position) : undefined;

  return {
    clearedCells: offsets.map((offset) => movePoint(position, axis, offset)),
    isBlank: [...joinedTiles, replacedTile].some((tile) => tile?.isBlank),
    nextPosition: findNextPosition(options, axis, target),
    target,
    value,
  };
}

/**
 * The typed character moves to the target, so typing continues right after it, unless the target is off the
 * typing line: then the position is still empty.
 */
function findNextPosition(options: Options, axis: Direction, target: Point): Point {
  const { direction, position } = options;

  if (axis !== direction && !isSamePoint(target, position)) {
    return position;
  }

  return isLastCell({ ...options, position: target }) ? target : movePoint(target, direction, 1);
}

function readTiles({ board, config, position }: Options, axis: Direction, step: number): Tile[] {
  const tiles: Tile[] = [];

  while (tiles.length + 1 < config.longestDigraphLength) {
    const tile = readTile(board, movePoint(position, axis, step * (tiles.length + 1)));

    if (typeof tile === 'undefined') {
      return tiles;
    }

    tiles.push(tile);
  }

  return tiles;
}

function readTile(board: Board, { x, y }: Point): Tile | undefined {
  const cell = board.rows[y]?.[x];
  return cell?.hasTile() ? cell.tile : undefined;
}

function isLastCell({ board, direction, position }: Options): boolean {
  return direction === 'horizontal' ? position.x + 1 >= board.columnsCount : position.y + 1 >= board.rowsCount;
}

function isSamePoint(first: Point, second: Point): boolean {
  return first.x === second.x && first.y === second.y;
}

function movePoint({ x, y }: Point, axis: Direction, offset: number): Point {
  return axis === 'horizontal' ? { x: x + offset, y } : { x, y: y + offset };
}

function spell(before: Tile[], character: string, after: Tile[] = []): string {
  return [...before.map((tile) => tile.character), character, ...after.map((tile) => tile.character)].join('');
}
