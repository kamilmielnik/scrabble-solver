import { EMPTY_CELL } from '@scrabble-solver/constants';

import { type BoardJson } from './BoardJson';
import { type BoardWord } from './BoardWord';
import { Cell } from './Cell';
import { type Direction } from './Direction';
import { Tile } from './Tile';

export class Board {
  public static create = (width: number, height: number): Board => {
    const rows = Array(height);
    const emptyRow = Array(width).fill(' ').join('');
    const emptyRows: string[] = rows.fill(emptyRow);
    return Board.fromStringArray(emptyRows);
  };

  public static fromJson = (json: BoardJson): Board => {
    return new Board({
      rows: json.map((row) => row.map(Cell.fromJson)),
    });
  };

  public static fromStringArray(stringArray: string[]): Board {
    return new Board({
      rows: stringArray.map((row, y) =>
        row.split('').map(
          (character, x) =>
            new Cell({
              isEmpty: !character || character === EMPTY_CELL,
              tile: character === EMPTY_CELL ? Tile.Null : new Tile({ character }),
              x,
              y,
            }),
        ),
      ),
    });
  }

  public readonly columnsCount: number;

  public readonly rows: Cell[][];

  public readonly rowsCount: number;

  constructor({ rows }: { rows: Cell[][] }) {
    this.rows = rows;
    this.columnsCount = rows[0].length;
    this.rowsCount = rows.length;
  }

  public get center(): Cell {
    const x = Math.floor(this.columnsCount / 2);
    const y = Math.floor(this.rowsCount / 2);
    return this.rows[y][x];
  }

  public clone(): Board {
    const rows = this.rows.map((row) => row.map((cell) => cell.clone()));
    return new Board({ rows });
  }

  public collides(cell: Cell): boolean {
    return this.collidesUp(cell) || this.collidesDown(cell) || this.collidesLeft(cell) || this.collidesRight(cell);
  }

  public collidesDown({ x, y }: Cell): boolean {
    return y < this.rowsCount - 1 && !this.rows[y + 1][x].isEmpty;
  }

  public collidesLeft({ x, y }: Cell): boolean {
    return x > 0 && !this.rows[y][x - 1].isEmpty;
  }

  public collidesRight({ x, y }: Cell): boolean {
    return x < this.columnsCount - 1 && !this.rows[y][x + 1].isEmpty;
  }

  public collidesUp({ x, y }: Cell): boolean {
    return y > 0 && !this.rows[y - 1][x].isEmpty;
  }

  public equals(other: Board): boolean {
    return (
      this.columnsCount === other.columnsCount &&
      this.rowsCount === other.rowsCount &&
      this.rows.every((row, rowIndex) => {
        return row.every((cell, cellIndex) => {
          return cell.equals(other.rows[rowIndex][cellIndex]);
        });
      })
    );
  }

  public getBlanksCount(): number {
    return this.rows.reduce((count, row) => {
      return count + row.reduce((rowCount, cell) => rowCount + (cell.tile.isBlank ? 1 : 0), 0);
    }, 0);
  }

  public getCollidingWords(word: BoardWord): BoardWord[] {
    const isHorizontal = word.direction === 'horizontal';
    const collidingDirection: Direction = isHorizontal ? 'vertical' : 'horizontal';
    const collidingWords: BoardWord[] = [];
    let { x, y } = word;

    while (x < this.columnsCount && y < this.rowsCount && !this.rows[y][x].isEmpty) {
      const collidingWord = readWordThrough(this, x, y, collidingDirection);

      if (collidingWord) {
        collidingWords.push(collidingWord);
      }

      x += isHorizontal ? 1 : 0;
      y += isHorizontal ? 0 : 1;
    }

    return collidingWords;
  }

  public getColumn(index: number): Cell[] {
    return this.rows.map((row) => row[index]);
  }

  public getRow(index: number): Cell[] {
    return this.rows[index];
  }

  public getTilesCount(): number {
    return this.rows.reduce((count, row) => {
      return count + row.reduce((rowCount, cell) => rowCount + (cell.hasTile() ? 1 : 0), 0);
    }, 0);
  }

  public getWords(): BoardWord[] {
    const horizontalWords = getWordsInRows(this.rows, 'horizontal');
    const verticalWords = getWordsInRows(transpose(this.rows), 'vertical');
    return [...horizontalWords, ...verticalWords];
  }

  public isEmpty(): boolean {
    return this.rows.every((row) => row.every(({ isEmpty }) => isEmpty));
  }

  public toJson(): BoardJson {
    return this.rows.map((row) => row.map((cell) => cell.toJson()));
  }

  public toString(): string {
    return this.rows.map((row) => row.map(String).join('')).join('\n');
  }

  public updateCell(x: number, y: number, updateCell: (cell: Cell) => Cell): void {
    this.rows[y][x] = updateCell(this.rows[y][x]);
  }

  public updateRow(y: number, updateRow: (cells: Cell[]) => Cell[]): void {
    this.rows[y] = updateRow(this.rows[y]);
  }
}

const transpose = <T>(array: T[][]): T[][] => {
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
};

/**
 * Cells in transposed rows keep their original coordinates,
 * so the first cell of a run is the word's start in both directions.
 */
const getWordsInRows = (cells: Cell[][], direction: Direction): BoardWord[] => {
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
};

const toBoardWord = (cells: Cell[], direction: Direction): BoardWord => {
  return {
    direction,
    word: cells.map((cell) => cell.tile.character).join(''),
    x: cells[0].x,
    y: cells[0].y,
  };
};

const readWordThrough = (board: Board, x: number, y: number, direction: Direction): BoardWord | undefined => {
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
};
