import { type TileJson } from '../TileJson';

import { isObject } from './isObject';

export const isTileJson = (value: unknown): value is TileJson => {
  return isObject(value) && typeof value.character === 'string' && typeof value.isBlank === 'boolean';
};
