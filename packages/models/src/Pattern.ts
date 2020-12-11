import Board from './Board';
import Cell, { CellJson } from './Cell';

interface PatternJson {
  cells: CellJson[];
  collisions: PatternJson[];
  word: string;
}

class Pattern {
  public readonly board: Board;

  public readonly cells: Cell[];

  constructor({ board, cells }: { board: Board; cells: Cell[] }) {
    this.board = board;
    this.cells = cells;
  }

  public canBePlaced(): boolean {
    const numberOfEmptyCells = this.getNumberOfEmptyCells();
    const isNumberOfUsedCellsInRange = numberOfEmptyCells >= 1 && numberOfEmptyCells <= 7;
    return (
      isNumberOfUsedCellsInRange &&
      (this.hasAtLeast1NonEmptyCell() || this.collides() || (this.goesThroughBoardCenter() && this.board.isEmpty()))
    );
  }

  public clone(): Pattern {
    return this.constructor({
      board: this.board,
      cells: this.cells.map((cell) => cell.clone())
    });
  }

  public collides(): boolean {
    return Boolean(this.cells.find((cell) => cell.isEmpty && this.board.collides(cell)));
  }

  public getIndexOfFirstCellWithoutTile(): number | undefined {
    return this.cells.findIndex((cell) => !cell.hasTile());
  }

  public getNumberOfEmptyCells(): number {
    return this.cells.filter((cell) => cell.isEmpty).length;
  }

  public goesThroughBoardCenter(): boolean {
    const x = Math.floor(this.board.numberOfColumns / 2);
    const y = Math.floor(this.board.numberOfRows / 2);
    return Boolean(this.cells.find((cell) => cell.x === x && cell.y === y && cell.isEmpty));
  }

  public hasAtLeast1EmptyCell(): boolean {
    return Boolean(this.cells.find((cell) => cell.isEmpty));
  }

  public hasAtLeast1NonEmptyCell(): boolean {
    return Boolean(this.cells.find((cell) => !cell.isEmpty));
  }

  public getCollisions(): Pattern[] {
    return [];
  }

  public toJson(): PatternJson {
    return {
      cells: this.cells.map((cell) => cell.toJson()),
      collisions: this.getCollisions().map((collision) => collision.toJson()),
      word: this.toString()
    };
  }

  public toString(): string {
    return this.cells.map(String).join('');
  }
}

export default Pattern;
