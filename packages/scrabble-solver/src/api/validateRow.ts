import { Config } from '@scrabble-solver/models';

import validateCell from './validateCell';

const validateRow = (row: unknown, rowIndex: number, config: Config): void => {
  if (!Array.isArray(row)) {
    throw new Error(`board[${rowIndex}] is not an array`);
  }

  if (row.length !== config.boardWidth) {
    throw new Error(`board[${rowIndex}] does not have ${config.boardWidth} cells`);
  }

  row.forEach((cell, cellIndex) => validateCell(cell, rowIndex, cellIndex, config));
};

export default validateRow;
