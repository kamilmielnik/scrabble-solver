import { CellJson } from './CellJson';
import { Tile } from './Tile';

export class Cell {
  public static fromJson = (json: CellJson): Cell => {
    return new Cell({
      isEmpty: json.isEmpty,
      tile: Tile.fromJson(json.tile),
      x: json.x,
      y: json.y,
    });
  };

  public readonly isEmpty: boolean;

  public tile: Tile;

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
      y: this.y,
    });
  }

  public equals(other: Cell): boolean {
    return this.x === other.x && this.y === other.y && this.isEmpty === other.isEmpty && this.tile.equals(other.tile);
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
      y: this.y,
    };
  }

  public toString(): string {
    return this.tile.toString();
  }
}
