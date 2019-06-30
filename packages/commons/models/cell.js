import Tile, { NullTile } from './tile';

class Cell {
  constructor({ x, y, tile = NullTile, isEmpty = true }) {
    this.x = x;
    this.y = y;
    this.tile = tile;
    this.isEmpty = isEmpty;
  }

  hasTile() {
    return this.tile !== NullTile;
  }

  isCandidate() {
    return this.isEmpty && this.hasTile();
  }

  toString() {
    return String(this.tile);
  }

  toJson() {
    return {
      x: this.x,
      y: this.y,
      tile: this.tile.toJson(),
      isEmpty: this.isEmpty
    };
  }

  clone() {
    return new this.constructor({
      x: this.x,
      y: this.y,
      tile: this.tile.clone(),
      isEmpty: this.isEmpty
    });
  }

  static fromJson(json) {
    if (!json) {
      return NullCell;
    }

    return new Cell({
      x: json.x,
      y: json.y,
      tile: Tile.fromJson(json.tile),
      isEmpty: json.isEmpty
    });
  }
}

export const NullCell = Object.freeze({
  hasTile: () => false,
  toString: () => '',
  toJson: () => null
});

export default Cell;
