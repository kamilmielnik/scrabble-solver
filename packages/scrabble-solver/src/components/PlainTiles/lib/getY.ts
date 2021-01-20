import { PLAIN_TILES_PADDING_VERTICAL, PLAIN_TILES_TILE_MARGIN, PLAIN_TILES_TILE_SIZE } from 'const';

const getY = (index: number): number => {
  return PLAIN_TILES_PADDING_VERTICAL + index * (PLAIN_TILES_TILE_SIZE + PLAIN_TILES_TILE_MARGIN);
};

export default getY;
