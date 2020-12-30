import { Trie } from '@kamilmielnik/trie';
import { literaki, scrabble } from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import logger from '@scrabble-solver/logger';
import { Board, Config, Tile } from '@scrabble-solver/models';
import Solver from '@scrabble-solver/solver';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

import { Locale } from 'types';

const dictionariesDirectory = path.resolve('../../dictionaries');

const getLocaleTrie = (locale: Locale): Trie =>
  Trie.deserialize(fs.readFileSync(path.join(dictionariesDirectory, `${locale}.txt`), 'utf-8'));

const CONFIGS = [literaki, scrabble];
const VALID_LOCALES: Locale[] = ['en-GB', 'en-US', 'pl-PL'];
const LOCALE_TRIES: Record<Locale, Trie> = {
  'en-GB': getLocaleTrie('en-GB'),
  'en-US': getLocaleTrie('en-US'),
  'pl-PL': getLocaleTrie('pl-PL'),
};

const solve = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
  try {
    const { board, configId, locale, characters } = parseRequest(request);
    const config = getConfig(configId, locale);
    const collection = LOCALE_TRIES[locale];
    const tiles = characters.map((character) => new Tile({ character, isBlank: character === BLANK }));
    const solver = new Solver(config, collection);
    const results = solver.solve(board, tiles);
    response.status(200).send(results.map((result) => result.toJson()));
  } catch (error) {
    logger.error(error);
    response.status(500).send({
      error: 'Server error',
      message: error.message,
    });
  }
};

const parseRequest = (
  request: NextApiRequest,
): { board: Board; characters: string[]; configId: string; locale: Locale } => {
  const { board, characters, configId, locale } = request.body;

  logger.info('solve - parseRequest', { board, characters, configId, locale });

  validateConfigId(configId);
  validateLocale(locale);
  const config = getConfig(configId, locale);
  validateBoard(board, config);
  validateCharacters(characters, config);

  return {
    board: Board.fromJson(board),
    configId,
    locale,
    characters,
  };
};

const getConfig = (configId: string, locale: Locale): Config => {
  const config = CONFIGS.find(({ id }) => id === configId);

  if (!config) {
    throw new Error(`Invalid "configId" parameter: not one of ${CONFIGS.map(({ id }) => id).join('/')}`);
  }

  return config[locale];
};

const validateConfigId = (configId: unknown): void => {
  if (!CONFIGS.some(({ id }) => id === configId)) {
    throw new Error(`Invalid "configId" parameter: not one of ${CONFIGS.map(({ id }) => id).join('/')}`);
  }
};

const validateLocale = (locale: unknown): void => {
  if (typeof locale !== 'string') {
    throw new Error('Invalid "locale" parameter: not a string');
  }

  if (!VALID_LOCALES.includes(locale as Locale)) {
    throw new Error(`Invalid "locale" parameter: must be one of: ${VALID_LOCALES.join(', ')}`);
  }
};

export const validateBoard = (board: unknown, config: Config): void => {
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

const validateRow = (row: unknown, rowIndex: number, config: Config): void => {
  if (!Array.isArray(row)) {
    throw new Error(`board[${rowIndex}] is not an array`);
  }

  if (row.length !== config.boardWidth) {
    throw new Error(`board[${rowIndex}] does not have ${config.boardWidth} cells`);
  }

  row.forEach((cell, cellIndex) => validateCell(cell, rowIndex, cellIndex, config));
};

const validateCell = (cell: unknown, rowIndex: number, cellIndex: number, config: Config): void => {
  if (typeof cell !== 'object') {
    throw new Error(`board[${rowIndex}][${cellIndex}] is not an object`);
  }

  const { x, y, tile, isEmpty } = cell as Record<string, unknown>;

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

const validateTile = (tile: unknown, config: Config): void => {
  if (typeof tile !== 'object') {
    throw new Error('is not an object');
  }

  if (tile !== null) {
    const { character, isBlank } = tile as Record<string, unknown>;

    validateCharacter(character, config);

    if (typeof isBlank !== 'boolean') {
      throw new Error('isBlank is not a boolean');
    }
  }
};

const validateCharacters = (characters: unknown, config: Config): void => {
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

const validateCharacter = (character: unknown, config: Config): void => {
  if (typeof character !== 'string') {
    throw new Error('character is not a string');
  }

  if (!config.hasCharacter(character) && character !== BLANK) {
    throw new Error('character is not valid');
  }
};

export default solve;
