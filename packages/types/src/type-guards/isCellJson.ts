import { type CellJson } from '../CellJson';

import { isObject } from './isObject';
import { isTileJson } from './isTileJson';

export const isCellJson = (value: unknown): value is CellJson => {
  return (
    isObject(value) &&
    typeof value.isEmpty === 'boolean' &&
    (isTileJson(value.tile) || value.tile === null) &&
    typeof value.x === 'number' &&
    typeof value.y === 'number'
  );
};
