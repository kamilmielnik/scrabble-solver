import { type Board } from './Board';
import { type BoardWord } from './BoardWord';
import { type Cell } from './Cell';
import { type Direction } from './Direction';

export function readBoardWords(board: Board): BoardWord[] {
  const horizontalWords = readWordsInRows(board.rows, 'horizontal');
  const verticalWords = readWordsInRows(transpose(board.rows), 'vertical');
  return [...horizontalWords, ...verticalWords];
}

export function readCollidingWords(board: Board, word: BoardWord): BoardWord[] {
  const isHorizontal = word.direction === 'horizontal';
  const collidingDirection: Direction = isHorizontal ? 'vertical' : 'horizontal';
  const collidingWords: BoardWord[] = [];
  let { x, y } = word;

  while (x < board.columnsCount && y < board.rowsCount && !board.rows[y][x].isEmpty) {
    const collidingWord = readWordThrough(board, x, y, collidingDirection);

    if (collidingWord) {
      collidingWords.push(collidingWord);
    }

    x += isHorizontal ? 1 : 0;
    y += isHorizontal ? 0 : 1;
  }

  return collidingWords;
}

/**
 * Cells in transposed rows keep their original coordinates,
 * so the first cell of a run is the word's start in both directions.
 */
function readWordsInRows(cells: Cell[][], direction: Direction): BoardWord[] {
  const words: BoardWord[] = [];

  for (const row of cells) {
    let currentWord: Cell[] = [];

    for (const cell of row) {
      if (!cell.isEmpty) {
        currentWord.push(cell);
      } else if (currentWord.length > 0) {
        if (currentWord.length > 1) {
          words.push(toBoardWord(currentWord, direction));
        }
        currentWord = [];
      }
    }

    if (currentWord.length > 1) {
      words.push(toBoardWord(currentWord, direction));
    }
  }

  return words;
}

function readWordThrough(board: Board, x: number, y: number, direction: Direction): BoardWord | undefined {
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

function toBoardWord(cells: Cell[], direction: Direction): BoardWord {
  return {
    direction,
    word: cells.map((cell) => cell.tile.character).join(''),
    x: cells[0].x,
    y: cells[0].y,
  };
}

function transpose<T>(array: T[][]): T[][] {
  const rows = array.length;
  const cols = array[0].length;
  const transposed: T[][] = Array(cols)
    .fill(null)
    .map(() => Array(rows));

  for (let y = 0; y < rows; ++y) {
    for (let x = 0; x < cols; ++x) {
      transposed[x][y] = array[y][x];
    }
  }

  return transposed;
}
