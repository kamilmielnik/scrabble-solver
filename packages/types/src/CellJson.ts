import { type TileJson } from './TileJson';

export interface CellJson {
  isEmpty: boolean;
  tile: TileJson | null;
  x: number;
  y: number;
}
