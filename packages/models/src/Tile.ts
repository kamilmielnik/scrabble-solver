import { EMPTY_CELL } from '@scrabble-solver/constants';

export interface TileJson {
  character: string;
  isBlank: boolean;
}

class Tile {
  public static fromJson(json: TileJson): Tile {
    if (!json) {
      return Tile.Null;
    }

    return new Tile({
      character: json.character,
      isBlank: json.isBlank
    });
  }

  public static Null: Tile = Object.freeze(new Tile({ character: '', isBlank: false }));

  public readonly character: string;

  public readonly isBlank: boolean;

  constructor({ character, isBlank = false }: { character: string; isBlank?: boolean }) {
    this.character = character;
    this.isBlank = isBlank;
  }

  public clone(): Tile {
    return new Tile({
      character: this.character,
      isBlank: this.isBlank
    });
  }

  public toJson(): TileJson {
    return {
      character: this.character,
      isBlank: this.isBlank
    };
  }

  public toString(): string {
    return this.character;
  }
}

export default Tile;
