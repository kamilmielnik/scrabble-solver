import Tile, { TileJson } from './Tile';

export interface CellJson {
  isEmpty: boolean;
  tile: TileJson;
  x: number;
  y: number;
}

class Cell {
  static fromJson(json: CellJson): Cell {
    if (!json) {
      return Cell.Null;
    }

    return new Cell({
      isEmpty: json.isEmpty,
      tile: Tile.fromJson(json.tile),
      x: json.x,
      y: json.y
    });
  }

  public static Null: Cell = Object.freeze(
    new Cell({
      isEmpty: true,
      tile: Tile.Null,
      x: 0,
      y: 0
    })
  );

  public readonly isEmpty: boolean;

  public readonly tile: Tile;

  public readonly x: number;

  public readonly y: number;

  constructor({ isEmpty = true, tile = Tile.Null, x, y }: { isEmpty?: boolean; tile?: Tile; x: number; y: number }) {
    this.isEmpty = isEmpty;
    this.tile = tile;
    this.x = x;
    this.y = y;
  }

  public clone(): Cell {
    return new Cell({
      isEmpty: this.isEmpty,
      tile: this.tile.clone(),
      x: this.x,
      y: this.y
    });
  }

  public hasTile(): boolean {
    return this.tile !== Tile.Null;
  }

  public isCandidate(): boolean {
    return this.isEmpty && this.hasTile();
  }

  public toJson(): CellJson {
    return {
      isEmpty: this.isEmpty,
      tile: this.tile.toJson(),
      x: this.x,
      y: this.y
    };
  }

  public toString(): string {
    return String(this.tile);
  }
}

export default Cell;
