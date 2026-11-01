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
  tilesBefore: Tile[];
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
 * Finds what typing a character over or next to the tiles that spell a digraph with it does to the board.
 * The letters of a digraph cannot stand next to each other as separate tiles, so they join even across the typing
 * direction. The digraph is a blank only if its first tile already was one: the typed character is no blank.
 */
export function findDigraphJoin(options: Options): DigraphJoin | undefined {
  const { direction } = options;

  return (
    findJoinInCell(options) ??
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

/**
 * A character typed over a tile completes the digraph that the tile begins, in any cell, as in the last one.
 * So typing a word over itself joins its letters: Spanish "lo" typed over "lo" becomes "ll", "o".
 */
function findJoinInCell(options: Options): DigraphJoin | undefined {
  const { board, character, config, direction, position } = options;
  const tile = readTile(board, position);

  if (typeof tile === 'undefined') {
    return undefined;
  }

  const value = spell([tile], character);

  if (!config.digraphs.includes(value)) {
    return undefined;
  }

  return createJoin(options, direction, { first: 0, last: 0 }, { tilesBefore: [tile], value });
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

      // A character that joins only the tiles before it does not type over the position, which keeps its tile.
      const typesOverPosition = countAfter > 0;
      const span = { first: -countBefore, last: typesOverPosition ? countAfter : -1 };
      return createJoin(options, axis, span, { tilesBefore: before, value });
    }
  }

  return undefined;
}

/**
 * Focus cannot leave the last cell, so the next character arrives in the cell that holds the previous one.
 * That cell keeps the beginning of a digraph until the character that completes it arrives.
 */
export function findJoinInLastCell(options: Options): DigraphJoin | undefined {
  const { board, character, config, direction, position } = options;
  const lastTile = readTile(board, position);

  if (!isLastCell(options) || typeof lastTile === 'undefined') {
    return undefined;
  }

  const tiles = [lastTile, ...readTiles(options, direction, -1)];
  const candidates = tiles.map((_, index): Candidate => {
    const tilesBefore = tiles.slice(0, index + 1).reverse();
    return { tilesBefore, value: spell(tilesBefore, character) };
  });
  const join =
    candidates.find(({ value }) => config.digraphs.includes(value)) ??
    candidates.find(({ value }) => config.isDigraphPrefix(value));

  if (typeof join === 'undefined') {
    return undefined;
  }

  return createJoin(options, direction, { first: 1 - join.tilesBefore.length, last: 0 }, join);
}

function createJoin(options: Options, axis: Direction, span: Span, { tilesBefore, value }: Candidate): DigraphJoin {
  const { position } = options;
  const offsets = Array.from({ length: span.last - span.first }, (_, index) => span.first + 1 + index);
  const target = movePoint(position, axis, span.first);

  return {
    clearedCells: offsets.map((offset) => movePoint(position, axis, offset)),
    isBlank: tilesBefore.at(0)?.isBlank ?? false,
    nextPosition: findNextPosition(options, axis, target),
    target,
    value,
  };
}

/**
 * The typed character moves to the target, so typing continues right after it, unless the target is off the
 * typing line. Then focus stays in the position, which is still empty: moving it would break the typing direction,
 * and it is up to the user to stop typing.
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
