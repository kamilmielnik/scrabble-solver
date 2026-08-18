import { type Board } from '../Board';
import { type Cell } from '../Cell';

export function getCollision(placed: Cell, board: Board, isHorizontal: boolean): Cell[] {
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
