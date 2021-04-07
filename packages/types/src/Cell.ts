import CellJson from './CellJson';
import Tile from './Tile';

class Cell {
  public static fromJson(json: CellJson | null): Cell {
    if (!json) {
      return Cell.Null;
    }

    return new Cell({
      isEmpty: json.isEmpty,
      tile: Tile.fromJson(json.tile),
      x: json.x,
      y: json.y,
    });
  }

  public static readonly Null: Cell = Object.freeze({
    isEmpty: true,
    tile: Tile.Null,
    x: 0,
    y: 0,
    clone: () => Cell.Null,
    equals: (other: Cell) => other === Cell.Null,
    hasTile: () => false,
    isCandidate: () => false,
    toString: () => '',
    toJson: () => null,
  });

  public readonly isEmpty: boolean;

  public tile: Tile;

  public readonly x: number;

  public readonly y: number;

  public readonly z: number;

  // eslint-disable-next-line no-undef
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

  public toJson(): CellJson | null {
    return {
      isEmpty: this.isEmpty,
      tile: this.tile.toJson(),
      x: this.x,
      y: this.y,
    };
  }

  public toString(): string {
    return String(this.tile);
  }
}

export default Cell;
