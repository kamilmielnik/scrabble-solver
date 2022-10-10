import { getLocaleConfig, isConfigId } from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import { dictionaries } from '@scrabble-solver/dictionaries';
import logger from '@scrabble-solver/logger';
import Solver from '@scrabble-solver/solver';
import { Board, Config, isBoardJson, isLocale, Locale, Tile } from '@scrabble-solver/types';
import { NextApiRequest, NextApiResponse } from 'next';

import { getServerLoggingData, validateBoard, validateCharacters } from 'api';

interface RequestData {
  board: Board;
  characters: string[];
  config: Config;
  locale: Locale;
}

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
    const trie = await dictionaries.get(locale);
    const tiles = characters.map((character) => new Tile({ character, isBlank: character === BLANK }));
    const solver = new Solver(config, trie);
    const results = solver.solve(board, tiles);
    response.status(200).send(results.map((result) => result.toJson()));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error('solve - error', { error, meta });
    response.status(500).send({ error: 'Server error', message });
  }
};

const parseRequest = (request: NextApiRequest): RequestData => {
  const { board, characters, configId, locale } = request.body;

  if (!isLocale(locale)) {
    throw new Error('Invalid "locale" parameter');
  }

  if (!isConfigId(configId)) {
    throw new Error('Invalid "configId" parameter');
  }

  const config = getLocaleConfig(configId, locale);

  if (!isBoardJson(board)) {
    throw new Error('Invalid "board" parameter');
  }

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
  const blanksCount = board.getBlanksCount() + blankTilesCount;

  if (blanksCount > config.blanksCount) {
    throw new Error(`Too many blank tiles passed (board: ${board.getBlanksCount()}, tiles: ${blankTilesCount})`);
  }
};

export default solve;
