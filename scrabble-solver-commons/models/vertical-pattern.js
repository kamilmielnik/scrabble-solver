import Pattern from './pattern';

class VerticalPattern extends Pattern {
  getCollisions() {
    const collisions = [];

    this.cells
      .filter((cell) => cell.isEmpty && (this.board.collidesLeft(cell) || this.board.collidesRight(cell)))
      .forEach((cell) => {
        const row = this.board.getRow(cell.y);
        let x = cell.x - 1;
        while (x >= 0 && row[x].hasTile()) {
          --x;
        }
        const previousCells = row.slice(x + 1, cell.x);
        x = cell.x + 1;
        while (x < row.length && row[x].hasTile()) {
          ++x;
        }
        const nextCells = row.slice(cell.x + 1, x);
        const cells = [ ...previousCells, cell, ...nextCells ];
        if (cells.length > 1) {
          const pattern = new Pattern({ board: this.board, cells }).clone();
          collisions.push(pattern);
        }
      });

    return collisions;
  }
}

export default VerticalPattern;
