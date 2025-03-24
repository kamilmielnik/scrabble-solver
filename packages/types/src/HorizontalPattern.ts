import { Pattern } from './Pattern';

export class HorizontalPattern extends Pattern {
  public clone(): Pattern {
    return new HorizontalPattern(
      this.board,
      this.cells.map((cell) => cell.clone()),
    );
  }

  public getCollisions(): Pattern[] {
    const collisions: Pattern[] = [];

    this.cells
      .filter((cell) => cell.isEmpty && (this.board.collidesUp(cell) || this.board.collidesDown(cell)))
      .forEach((cell) => {
        const column = this.board.getColumn(cell.x);
        let y = cell.y - 1;
        while (y >= 0 && column[y].hasTile()) {
          --y;
        }
        const previousCells = column.slice(y + 1, cell.y);
        y = cell.y + 1;
        while (y < column.length && column[y].hasTile()) {
          ++y;
        }
        const nextCells = column.slice(cell.y + 1, y);
        const cells = [...previousCells, cell, ...nextCells];
        if (cells.length > 1) {
          const pattern = new Pattern(this.board, cells);
          collisions.push(pattern);
        }
      });

    return collisions;
  }
}
