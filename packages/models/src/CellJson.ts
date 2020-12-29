import TileJson from './TileJson';

interface CellJson {
  isEmpty: boolean;
  tile: TileJson | null;
  x: number;
  y: number;
}

export default CellJson;
