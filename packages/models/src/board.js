import { EMPTY_CELL } from '@scrabble-solver/constants';

import Cell from './cell';
import Tile, { NullTile } from './tile';

class Board {
  constructor({ board }) {
    this.board = board;
    this.numberOfRows = board.length;
    this.numberOfColumns = board[0].length;
  }

  isEmpty() {
    return this.board.every((row) => row.every(({ isEmpty }) => isEmpty));
  }

  getRow(index) {
    return this.board[index];
  }

  getColumn(index) {
    return this.board.map((row) => row[index]);
  }

  collides(cell) {
    return this.collidesUp(cell) || this.collidesDown(cell) || this.collidesLeft(cell) || this.collidesRight(cell);
  }

  collidesUp({ x, y }) {
    return y > 0 && !this.board[y - 1][x].isEmpty;
  }

  collidesDown({ x, y }) {
    return y < this.numberOfRows - 1 && !this.board[y + 1][x].isEmpty;
  }

  collidesLeft({ x, y }) {
    return x > 0 && !this.board[y][x - 1].isEmpty;
  }

  collidesRight({ x, y }) {
    return x < this.numberOfColumns - 1 && !this.board[y][x + 1].isEmpty;
  }

  toString() {
    return '';
  }

  toJson() {
    return this.board.map((row) => row.map((cell) => cell.toJson()));
  }

  static fromJson(json) {
    return new Board({
      board: json.map((row) => row.map(Cell.fromJson))
    });
  }

  static fromStringArray(stringArray) {
    return new Board({
      board: stringArray.map((row, y) =>
        row.split('').map(
          (character, x) =>
            new Cell({
              x,
              y,
              isEmpty: !character || character === EMPTY_CELL,
              tile: character === EMPTY_CELL ? NullTile : new Tile({ character })
            })
        )
      )
    });
  }
}

export default Board;
