import * as configs from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';

const VALID_LOCALES = ['en-GB', 'en-US', 'pl-PL'];

export const validateConfigId = (configId) => {
  if (!Object.keys(configs).includes(configId)) {
    throw new Error(`Invalid "configId" parameter: not one of ${Object.keys(configs).join('/')}`);
  }
};

export const validateLocale = (locale) => {
  if (typeof locale !== 'string') {
    throw new Error('Invalid "locale" parameter: not a string');
  }

  if (!VALID_LOCALES.includes(locale)) {
    throw new Error(`Invalid "locale" parameter: must be one of: ${VALID_LOCALES.join(', ')}`);
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

  try {
    validateTile(tile, config);
  } catch (error) {
    throw new Error(`board[${rowIndex}][${cellIndex}].tile ${error.message}`);
  }
};

const validateTile = (tile, config) => {
  if (typeof tile !== 'object') {
    throw new Error('is not an object');
  }

  if (tile !== null) {
    const { character, isBlank } = tile;

    validateCharacter(character, config);

    if (typeof isBlank !== 'boolean') {
      throw new Error('isBlank is not a boolean');
    }
  }
};

export const validateCharacters = (characters, config) => {
  if (!Array.isArray(characters)) {
    throw new Error('Invalid "characters" parameter: not an array');
  }

  if (characters.length === 0) {
    throw new Error('Invalid "characters" parameter: empty array');
  }

  characters.forEach((character, characterIndex) => {
    try {
      validateCharacter(character, config);
    } catch (error) {
      throw new Error(`Invalid "characters" parameter: characters[${characterIndex}] ${error.message}`);
    }
  });
};

const validateCharacter = (character, config) => {
  if (!config.hasCharacter(character) && character !== BLANK) {
    throw new Error('character is not valid');
  }
};
