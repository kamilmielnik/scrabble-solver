import * as configs from '@scrabble-solver/configs';

export const validateConfigId = (configId) => {
  if (!Object.keys(configs).includes(configId)) {
    throw new Error(`Invalid "configId" parameter: not one of ${Object.keys(configs).join('/')}`);
  }
};

export const validateBoard = (board, config) => {
  if (!Array.isArray(board)) {
    throw new Error('Invalid "board" parameter: not an array');
  }

  if (board.length !== config.boardHeight) {
    throw new Error(`Invalid "board" parameter: does not have ${config.boardHeight} rows`);
  }

  try {
    board.forEach((row, rowIndex) => validateRow(row, rowIndex, config));
  } catch (error) {
    throw new Error(`Invalid "board" parameter: ${error.message}`);
  }
};

const validateRow = (row, rowIndex, config) => {
  if (row.length !== config.boardWidth) {
    throw new Error(`board[${rowIndex}] does not have ${config.boardWidth} cells`);
  }

  row.forEach((cell, cellIndex) => validateCell(cell, rowIndex, cellIndex, config));
};

const validateCell = (cell, rowIndex, cellIndex, config) => {
  if (typeof cell !== 'object') {
    throw new Error(`board[${rowIndex}][${cellIndex}] is not an object`);
  }

  const { x, y, tile, isEmpty } = cell;

  if (x < 0 || x >= config.boardWidth) {
    throw new Error(`board[${rowIndex}][${cellIndex}].x is out of bounds`);
  }

  if (y < 0 || y >= config.boardHeight) {
    throw new Error(`board[${rowIndex}][${cellIndex}].y is out of bounds`);
  }

  if (typeof isEmpty !== 'boolean') {
    throw new Error(`board[${rowIndex}][${cellIndex}].isEmpty is not a boolean`);
  }

  validateTile(tile, rowIndex, cellIndex, config);
};

const validateTile = (tile, rowIndex, cellIndex, config) => {
  if (typeof tile !== 'object') {
    throw new Error(`board[${rowIndex}][${cellIndex}].tile is not an object`);
  }

  if (tile !== null) {
    const { character, isBlank } = tile;

    if (!config.alphabet.includes(character)) {
      throw new Error(`board[${rowIndex}][${cellIndex}].tile.character is not valid`);
    }

    if (typeof isBlank !== 'boolean') {
      throw new Error(`board[${rowIndex}][${cellIndex}].tile.isBlank is not a boolean`);
    }
  }
};
