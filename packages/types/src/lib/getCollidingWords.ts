import { type Board } from '../Board';
import { type BoardWord } from '../BoardWord';
import { type Direction } from '../Direction';

import { getWordThrough } from './getWordThrough';

export function getCollidingWords(board: Board, word: BoardWord): BoardWord[] {
  const isHorizontal = word.direction === 'horizontal';
  const collidingDirection: Direction = isHorizontal ? 'vertical' : 'horizontal';
  const collidingWords: BoardWord[] = [];
  let { x, y } = word;

  while (x < board.columnsCount && y < board.rowsCount && !board.rows[y][x].isEmpty) {
    const collidingWord = getWordThrough(board, x, y, collidingDirection);

    if (collidingWord) {
      collidingWords.push(collidingWord);
    }

    x += isHorizontal ? 1 : 0;
    y += isHorizontal ? 0 : 1;
  }

  return collidingWords;
}
