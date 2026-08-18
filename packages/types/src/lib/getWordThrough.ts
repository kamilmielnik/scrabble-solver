import { type Board } from '../Board';
import { type BoardWord } from '../BoardWord';
import { type Cell } from '../Cell';
import { type Direction } from '../Direction';

import { toBoardWord } from './toBoardWord';

export function getWordThrough(board: Board, x: number, y: number, direction: Direction): BoardWord | undefined {
  const stepX = direction === 'horizontal' ? 1 : 0;
  const stepY = direction === 'horizontal' ? 0 : 1;
  let startX = x;
  let startY = y;

  while (startX - stepX >= 0 && startY - stepY >= 0 && !board.rows[startY - stepY][startX - stepX].isEmpty) {
    startX -= stepX;
    startY -= stepY;
  }

  const cells: Cell[] = [];
  let cellX = startX;
  let cellY = startY;

  while (cellX < board.columnsCount && cellY < board.rowsCount && !board.rows[cellY][cellX].isEmpty) {
    cells.push(board.rows[cellY][cellX]);
    cellX += stepX;
    cellY += stepY;
  }

  return cells.length > 1 ? toBoardWord(cells, direction) : undefined;
}
