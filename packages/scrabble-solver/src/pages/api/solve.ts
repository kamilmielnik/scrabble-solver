import { Trie } from '@kamilmielnik/trie';
import { BLANK } from '@scrabble-solver/constants';
import logger from '@scrabble-solver/logger';
import { Board, Tile } from '@scrabble-solver/models';
import Solver from '@scrabble-solver/solver';
import { NextApiRequest, NextApiResponse } from 'next';

import {
  getConfig,
  readLocaleDictionary,
  validateBoard,
  validateCharacters,
  validateConfigId,
  validateLocale,
} from 'api';
import { Locale } from 'types';

const localeTries: Record<Locale, Trie> = {
  'en-GB': readLocaleDictionary('en-GB'),
  'en-US': readLocaleDictionary('en-US'),
  'pl-PL': readLocaleDictionary('pl-PL'),
};

const solve = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
  try {
    const { board, configId, locale, characters } = parseRequest(request);
    const config = getConfig(configId, locale);
    const trie = localeTries[locale];
    const tiles = characters.map((character) => new Tile({ character, isBlank: character === BLANK }));
    const solver = new Solver(config, trie);
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

export default solve;
