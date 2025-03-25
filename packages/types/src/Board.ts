import { EMPTY_CELL } from '@scrabble-solver/constants';

import { BoardJson } from './BoardJson';
import { Cell } from './Cell';
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

  public getWords(): string[] {
    const columns: Cell[][] = [];

    for (let x = 0; x < this.columnsCount; ++x) {
      const column: Cell[] = [];

      for (let y = 0; y < this.rowsCount; ++y) {
        column.push(this.rows[y][x]);
      }

      columns.push(column);
    }

    const columnsBoard = new Board({ rows: columns });
    const lines = this.toString().split('\n').concat(columnsBoard.toString().split('\n'));
    const words = lines
      .flatMap((line) => line.replaceAll(/\s+/g, EMPTY_CELL).split(' '))
      .filter((word) => word.length > 1);

    return words;
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
