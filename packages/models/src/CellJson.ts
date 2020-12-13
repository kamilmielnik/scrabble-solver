import TileJson from './TileJson';

interface CellJson {
  isEmpty: boolean;
  tile: TileJson;
  x: number;
  y: number;
}

export default CellJson;
