import { isObject } from './isObject';

export interface TileJson {
  character: string;
  isBlank: boolean;
}

export const isTileJson = (value: unknown): value is TileJson => {
  return isObject(value) && typeof value.character === 'string' && typeof value.isBlank === 'boolean';
};
