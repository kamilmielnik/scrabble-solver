import { BOARD_TILE_FONT_SIZE_MIN, BOARD_TILE_FONT_SIZE_POINTS_MIN } from 'const';

const getTileSizes = (tileSize: number) => ({
  pointsFontSize: Math.max(Math.round(tileSize * 0.25), BOARD_TILE_FONT_SIZE_POINTS_MIN),
  tileFontSize: Math.max(Math.round(tileSize * 0.6), BOARD_TILE_FONT_SIZE_MIN),
  tileSize,
});

export default getTileSizes;
