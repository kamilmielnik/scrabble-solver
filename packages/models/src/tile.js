import { EMPTY_CELL } from '@scrabble-solver/constants';

class Tile {
  constructor({ character, isBlank = false }) {
    this.character = character;
    this.isBlank = isBlank;
  }

  toString() {
    return this.character;
  }

  toJson() {
    return {
      character: this.character,
      isBlank: this.isBlank
    };
  }

  clone() {
    return new this.constructor({
      character: this.character,
      isBlank: this.isBlank
    });
  }

  static fromJson(json) {
    if (!json) {
      return NullTile;
    }

    return new Tile({
      character: json.character,
      isBlank: json.isBlank
    });
  }
}

export const NullTile = Object.freeze({
  character: EMPTY_CELL,
  isBlank: false,
  toString: () => EMPTY_CELL,
  toJson: () => null,
  clone: () => NullTile
});

export default Tile;
