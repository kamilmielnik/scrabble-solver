import { PLAIN_TILES_PADDING_HORIZONTAL, PLAIN_TILES_TILE_MARGIN, PLAIN_TILES_TILE_SIZE } from 'parameters';

export const getX = (index: number): number => {
  return PLAIN_TILES_PADDING_HORIZONTAL + index * (PLAIN_TILES_TILE_SIZE + PLAIN_TILES_TILE_MARGIN);
};
