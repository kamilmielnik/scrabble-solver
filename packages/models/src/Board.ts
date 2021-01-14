import { EMPTY_CELL } from '@scrabble-solver/constants';

import BoardJson from './BoardJson';
import Cell from './Cell';
import Tile from './Tile';

class Board {
  public static create(width: number, height: number): Board {
    return Board.fromStringArray(Array(height).fill(Array(width).fill(' ').join('')));
  }

  public static fromJson(json: BoardJson): Board {
    return new Board({
      board: json.map((row) => row.map(Cell.fromJson)),
    });
  }

  public static fromStringArray(stringArray: string[]): Board {
    return new Board({
      board: stringArray.map((row, y) =>
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

  public readonly board: Cell[][];

  public readonly numberOfColumns: number;

  public readonly numberOfRows: number;

  constructor({ board }: { board: Cell[][] }) {
    this.board = board;
    this.numberOfColumns = board[0].length;
    this.numberOfRows = board.length;
  }

  public get center(): Cell {
    const x = Math.floor(this.numberOfColumns / 2);
    const y = Math.floor(this.numberOfRows / 2);
    return this.board[y][x];
  }

  public clone(): Board {
    const board = this.board.map((row) => row.map((cell) => cell.clone()));
    return new Board({ board });
  }

  public collides(cell: Cell): boolean {
    return this.collidesUp(cell) || this.collidesDown(cell) || this.collidesLeft(cell) || this.collidesRight(cell);
  }

  public collidesDown({ x, y }: Cell): boolean {
    return y < this.numberOfRows - 1 && !this.board[y + 1][x].isEmpty;
  }

  public collidesLeft({ x, y }: Cell): boolean {
    return x > 0 && !this.board[y][x - 1].isEmpty;
  }

  public collidesRight({ x, y }: Cell): boolean {
    return x < this.numberOfColumns - 1 && !this.board[y][x + 1].isEmpty;
  }

  public collidesUp({ x, y }: Cell): boolean {
    return y > 0 && !this.board[y - 1][x].isEmpty;
  }

  public getBlanksCount(): number {
    return this.board.reduce((count, row) => {
      return count + row.reduce((rowCount, cell) => (cell.tile.isBlank ? rowCount + 1 : rowCount), 0);
    }, 0);
  }

  public getColumn(index: number): Cell[] {
    return this.board.map((row) => row[index]);
  }

  public getRow(index: number): Cell[] {
    return this.board[index];
  }

  public getTilesCount(): number {
    return this.board.reduce((count, row) => {
      return count + row.reduce((rowCount, cell) => (cell.hasTile() ? rowCount + 1 : rowCount), 0);
    }, 0);
  }

  public isEmpty(): boolean {
    return this.board.every((row) => row.every(({ isEmpty }) => isEmpty));
  }

  public toJson(): BoardJson {
    return this.board.map((row) => row.map((cell) => cell.toJson()));
  }

  public toString(): string {
    return this.board.map((row) => row.map(String)).join('\n');
  }

  public updateCell(x: number, y: number, updateCell: (cell: Cell) => Cell): void {
    this.board[y][x] = updateCell(this.board[y][x]);
  }

  public updateRow(y: number, updateRow: (cells: Cell[]) => Cell[]): void {
    this.board[y] = updateRow(this.board[y]);
  }
}

export default Board;
