import { Config } from '@scrabble-solver/types';

import { BOARD_CELL_BORDER_WIDTH, BOARD_TILE_SIZE_MAX } from 'parameters';

export const getCellSize = (config: Config, width: number, height: number): number => {
  const maxWidth = (width - BOARD_CELL_BORDER_WIDTH) / config.boardWidth - BOARD_CELL_BORDER_WIDTH;
  const maxHeight = (height - BOARD_CELL_BORDER_WIDTH) / config.boardHeight - BOARD_CELL_BORDER_WIDTH;
  const cellSize = Math.min(maxWidth, maxHeight);
  return Math.floor(Math.min(cellSize, BOARD_TILE_SIZE_MAX));
};
