import { Config } from '@scrabble-solver/types';

import validateTile from './validateTile';

const validateCell = (cell: unknown, rowIndex: number, cellIndex: number, config: Config): void => {
  if (typeof cell !== 'object') {
    throw new Error(`board[${rowIndex}][${cellIndex}] is not an object`);
  }

  const { x, y, tile, isEmpty } = cell as Record<string, unknown>;

  if (typeof x !== 'number') {
    throw new Error(`board[${rowIndex}][${cellIndex}].x is not a number`);
  }

  if (x < 0 || x >= config.boardWidth) {
    throw new Error(`board[${rowIndex}][${cellIndex}].x is out of bounds`);
  }

  if (typeof y !== 'number') {
    throw new Error(`board[${rowIndex}][${cellIndex}].y is not a number`);
  }

  if (y < 0 || y >= config.boardHeight) {
    throw new Error(`board[${rowIndex}][${cellIndex}].y is out of bounds`);
  }

  if (typeof isEmpty !== 'boolean') {
    throw new Error(`board[${rowIndex}][${cellIndex}].isEmpty is not a boolean`);
  }

  try {
    validateTile(tile, config);
  } catch (error) {
    throw new Error(`board[${rowIndex}][${cellIndex}].tile ${error.message}`);
  }
};

export default validateCell;
