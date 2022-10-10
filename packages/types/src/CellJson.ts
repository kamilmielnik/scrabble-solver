import isObject from './isObject';
import TileJson, { isTileJson } from './TileJson';

interface CellJson {
  isEmpty: boolean;
  tile: TileJson | null;
  x: number;
  y: number;
}

export const isCellJson = (value: unknown): value is CellJson => {
  return (
    isObject(value) &&
    typeof value.isEmpty === 'boolean' &&
    (isTileJson(value.tile) || value.tile === null) &&
    typeof value.x === 'number' &&
    typeof value.y === 'number'
  );
};

export default CellJson;
