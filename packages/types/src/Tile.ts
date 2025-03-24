import { EMPTY_CELL } from '@scrabble-solver/constants';

import { TileJson } from './TileJson';

export class Tile {
  public static fromJson(json: TileJson | null): Tile {
    if (!json) {
      return Tile.Null;
    }

    return new Tile({
      character: json.character,
      isBlank: json.isBlank,
    });
  }

  public static readonly Null: Tile = Object.freeze({
    character: EMPTY_CELL,
    isBlank: false,
    clone: () => Tile.Null,
    equals: (other: Tile) => other === Tile.Null,
    toJson: () => null,
    toString: () => EMPTY_CELL,
  });

  public character: string;

  public isBlank: boolean;

  constructor({ character, isBlank = false }: { character: string; isBlank?: boolean }) {
    this.character = character;
    this.isBlank = isBlank;
  }

  public clone(): Tile {
    return new Tile({
      character: this.character,
      isBlank: this.isBlank,
    });
  }

  public equals(other: Tile): boolean {
    return this.character === other.character && this.isBlank === other.isBlank;
  }

  public toJson(): TileJson | null {
    return {
      character: this.character,
      isBlank: this.isBlank,
    };
  }

  public toString(): string {
    return this.character;
  }
}
