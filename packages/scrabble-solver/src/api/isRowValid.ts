import { CellJson, Config } from '@scrabble-solver/types';

import isCellValid from './isCellValid';

const isRowValid = (row: CellJson[], config: Config): boolean => {
  if (row.length !== config.boardWidth) {
    return false;
  }

  for (const cell of row) {
    if (!isCellValid(cell, config)) {
      return false;
    }
  }

  return true;
};

export default isRowValid;
