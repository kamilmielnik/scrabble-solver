import { Trie } from '@kamilmielnik/trie';
import { getLocaleConfig } from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import logger from '@scrabble-solver/logger';
import { Board, Config, Tile } from '@scrabble-solver/models';
import Solver from '@scrabble-solver/solver';
import { NextApiRequest, NextApiResponse } from 'next';

import {
  getServerLoggingData,
  readLocaleDictionary,
  validateBoard,
  validateCharacters,
  validateConfigId,
  validateLocale,
} from 'api';
import { Locale } from 'types';

interface RequestData {
  board: Board;
  characters: string[];
  config: Config;
  locale: Locale;
}

const localeTries: Record<Locale, Trie> = {
  'en-GB': readLocaleDictionary('en-GB'),
  'en-US': readLocaleDictionary('en-US'),
  'pl-PL': readLocaleDictionary('pl-PL'),
};

const solve = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
  const meta = getServerLoggingData(request);

  try {
    const { board, characters, config, locale } = parseRequest(request);
    logger.info('solve - request', {
      meta,
      payload: {
        board: board.toString(),
        boardBlanksCount: board.getBlanksCount(),
        boardTilesCount: board.getTilesCount(),
        characters: characters.join(''),
        configId: request.body.configId,
        locale,
      },
    });
    validateRequest({ board, characters, config, locale });
    const trie = localeTries[locale];
    const tiles = characters.map((character) => new Tile({ character, isBlank: character === BLANK }));
    const solver = new Solver(config, trie);
    const results = solver.solve(board, tiles);
    response.status(200).send(results.map((result) => result.toJson()));
  } catch (error) {
    logger.error('solve - error', { error, meta });
    response.status(500).send({
      error: 'Server error',
      message: error.message,
    });
  }
};

const parseRequest = (request: NextApiRequest): RequestData => {
  const { board, characters, configId, locale } = request.body;

  validateConfigId(configId);
  validateLocale(locale);
  const config = getLocaleConfig(configId, locale);
  validateBoard(board, config);
  validateCharacters(characters, config);

  return {
    board: Board.fromJson(board),
    characters,
    config,
    locale,
  };
};

const validateRequest = ({ board, characters, config }: RequestData): void => {
  const blankTilesCount = characters.filter((character) => character === BLANK).length;

  if (board.getTilesCount() + blankTilesCount > config.numberOfBlanks) {
    throw new Error(`Too many blank tiles passed (board: ${board.getTilesCount()}, tiles: ${blankTilesCount})`);
  }
};

export default solve;
