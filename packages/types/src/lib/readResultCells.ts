import { type Board } from '../Board';
import { Cell } from '../Cell';
import { type ResultJson } from '../ResultJson';
import { Tile } from '../Tile';

export function readCells(json: ResultJson, board: Board): Cell[] {
  const stepX = json.isHorizontal ? 1 : 0;
  const stepY = json.isHorizontal ? 0 : 1;
  const cells: Cell[] = [];
  let placedIndex = 0;
  let { x, y } = json;

  while (y < board.rowsCount && x < board.columnsCount) {
    const boardCell = board.rows[y][x];

    if (boardCell.isFilled()) {
      cells.push(boardCell.clone());
    } else if (placedIndex < json.tiles.length) {
      cells.push(readPlacedCell(json, placedIndex, x, y));
      placedIndex += 1;
    } else {
      break;
    }

    x += stepX;
    y += stepY;
  }

  return cells;
}

export function readCollisions(cells: Cell[], board: Board, isHorizontal: boolean): Cell[][] {
  const collisions: Cell[][] = [];

  for (const cell of cells) {
    if (cell.isFilled()) {
      continue;
    }

    const collision = readCollision(cell, board, isHorizontal);

    if (collision.length > 1) {
      collisions.push(collision);
    }
  }

  return collisions;
}

function readPlacedCell(json: ResultJson, placedIndex: number, x: number, y: number): Cell {
  const character = json.tiles[placedIndex];
  const isBlank = json.blankIndices.includes(placedIndex);
  return new Cell({ isEmpty: true, tile: new Tile({ character, isBlank }), x, y });
}

function readCollision(placed: Cell, board: Board, isHorizontal: boolean): Cell[] {
  const stepX = isHorizontal ? 0 : 1;
  const stepY = isHorizontal ? 1 : 0;
  let x = placed.x - stepX;
  let y = placed.y - stepY;

  while (x >= 0 && y >= 0 && board.rows[y][x].isFilled()) {
    x -= stepX;
    y -= stepY;
  }

  x += stepX;
  y += stepY;

  const collision: Cell[] = [];

  while (y < board.rowsCount && x < board.columnsCount) {
    if (x === placed.x && y === placed.y) {
      collision.push(placed);
    } else {
      const boardCell = board.rows[y][x];

      if (!boardCell.isFilled()) {
        break;
      }

      collision.push(boardCell.clone());
    }

    x += stepX;
    y += stepY;
  }

  return collision;
}
