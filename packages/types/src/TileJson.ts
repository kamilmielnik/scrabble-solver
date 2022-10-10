import isObject from './isObject';

interface TileJson {
  character: string;
  isBlank: boolean;
}

export const isTileJson = (value: unknown): value is TileJson => {
  return isObject(value) && typeof value.character === 'string' && typeof value.isBlank === 'boolean';
};

export default TileJson;
