import { CellJson, Config } from '@scrabble-solver/types';

import isCharacterValid from './isCharacterValid';

const isCellValid = (cell: CellJson, config: Config): boolean => {
  const { isEmpty, tile, x, y } = cell;

  if (x < 0 || x >= config.boardSize) {
    return false;
  }

  if (y < 0 || y >= config.boardSize) {
    return false;
  }

  if (isEmpty && tile !== null) {
    return false;
  }

  if (tile !== null && !isCharacterValid(tile.character)) {
    return false;
  }

  return true;
};

export default isCellValid;
