class Pattern {
  constructor({ board, cells }) {
    this.board = board;
    this.cells = cells;
  }

  getNumberOfEmptyCells() {
    return this.cells.filter((cell) => cell.isEmpty).length;
  }

  getIndexOfFirstCellWithoutTile() {
    return this.cells.findIndex((cell) => !cell.hasTile());
  }

  hasAtLeast1EmptyCell() {
    return Boolean(this.cells.find((cell) => cell.isEmpty));
  }

  hasAtLeast1NoneEmptyCell() {
    return Boolean(this.cells.find((cell) => !cell.isEmpty));
  }

  collides() {
    return Boolean(this.cells.find((cell) => cell.isEmpty && this.board.collides(cell)));
  }

  goesThroughBoardCenter() {
    const x = Math.floor(this.board.numberOfColumns / 2);
    const y = Math.floor(this.board.numberOfRows / 2);
    return this.cells.find((cell) => cell.x === x && cell.y === y && cell.isEmpty);
  }

  canBePlaced() {
    const numberOfEmptyCells = this.getNumberOfEmptyCells();
    const isNumberOfUsedCellsInRange = numberOfEmptyCells >= 1 && numberOfEmptyCells <= 7;
    return isNumberOfUsedCellsInRange && (
      this.hasAtLeast1NoneEmptyCell() || this.collides() || (this.goesThroughBoardCenter() && this.board.isEmpty())
    );
  }

  getCollisions() {
    return [];
  }

  toJson() {
    return {
      cells: this.cells.map((cell) => cell.toJson()),
      collisions: this.getCollisions().map((collision) => collision.toJson()),
      word: this.toString()
    };
  }

  toString() {
    return this.cells.map(String).join('');
  }

  clone() {
    return new this.constructor({
      board: this.board,
      cells: this.cells.map((cell) => cell.clone())
    });
  }
}

export default Pattern;
