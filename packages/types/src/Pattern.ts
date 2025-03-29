import { type Board } from './Board';
import { type Cell } from './Cell';
import { type Config } from './Config';
import { type PatternJson } from './PatternJson';

export class Pattern {
  public readonly board: Board;

  public readonly cells: Cell[];

  constructor(board: Board, cells: Cell[]) {
    this.board = board;
    this.cells = cells;
  }

  public canBePlaced(config: Config): boolean {
    const emptyCellsCount = this.getEmptyCellsCount();
    const isUsedCellsCountInRange = emptyCellsCount >= 1 && emptyCellsCount <= config.rackSize;
    return (
      isUsedCellsCountInRange &&
      (this.hasAtLeast1NonEmptyCell() || this.collides() || (this.goesThroughBoardCenter() && this.board.isEmpty()))
    );
  }

  public clone(): Pattern {
    return new Pattern(
      this.board,
      this.cells.map((cell) => cell.clone()),
    );
  }

  public collides(): boolean {
    return this.cells.some((cell) => cell.isEmpty && this.board.collides(cell));
  }

  public getIndexOfFirstCellWithoutTile(): number {
    return this.cells.findIndex((cell) => !cell.hasTile());
  }

  public getEmptyCellsCount(): number {
    return this.cells.filter((cell) => cell.isEmpty).length;
  }

  public goesThroughBoardCenter(): boolean {
    return this.cells.some((cell) => cell.x === this.board.center.x && cell.y === this.board.center.y && cell.isEmpty);
  }

  public hasAtLeast1EmptyCell(): boolean {
    return this.cells.some((cell) => cell.isEmpty);
  }

  public hasAtLeast1NonEmptyCell(): boolean {
    return this.cells.some((cell) => !cell.isEmpty);
  }

  public getCollisions(): Pattern[] {
    return [];
  }

  public toJson(): PatternJson {
    return {
      cells: this.cells.map((cell) => cell.toJson()),
      collisions: this.getCollisions().map((collision) => collision.toJson()),
      word: this.toString(),
    };
  }

  public toString(): string {
    return this.cells.reduce((result, cell) => result + cell.toString(), '');
  }
}
