import { type Board } from '../Board';
import { type Cell } from '../Cell';

import { getCollision } from './getCollision';

export function getCollisions(board: Board, cells: Cell[], isHorizontal: boolean): Cell[][] {
  const collisions: Cell[][] = [];

  for (const cell of cells) {
    if (cell.isFilled()) {
      continue;
    }

    const collision = getCollision(cell, board, isHorizontal);

    if (collision.length > 1) {
      collisions.push(collision);
    }
  }

  return collisions;
}
