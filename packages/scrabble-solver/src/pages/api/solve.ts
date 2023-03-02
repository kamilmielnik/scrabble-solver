import { getLocaleConfig, isConfigId } from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import { dictionaries } from '@scrabble-solver/dictionaries';
import logger from '@scrabble-solver/logger';
import { solve as solveScrabble } from '@scrabble-solver/solver';
import { Board, Config, isBoardJson, isLocale, Locale, Tile } from '@scrabble-solver/types';
import { NextApiRequest, NextApiResponse } from 'next';

import { getServerLoggingData, isBoardValid } from 'api';
import { isStringArray } from 'lib';

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

    const trie = await dictionaries.get(locale);
    const tiles = characters.map((character) => new Tile({ character, isBlank: character === BLANK }));
    const results = solveScrabble(trie, config, board, tiles);
    response.status(200).send(results);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error('solve - error', { error, meta });
    response.status(500).send({ error: 'Server error', message });
    throw error;
  }
};

const parseRequest = (request: NextApiRequest): RequestData => {
  const { board: boardJson, characters, configId, locale } = request.body;

  if (!isLocale(locale)) {
    throw new Error('Invalid "locale" parameter');
  }

  if (!isConfigId(configId)) {
    throw new Error('Invalid "configId" parameter');
  }

  if (!isStringArray(characters) || characters.length === 0) {
    throw new Error('Invalid "characters" parameter');
  }

  const config = getLocaleConfig(configId, locale);

  for (const character of characters) {
    if (!config.hasCharacter(character) && character !== BLANK) {
      throw new Error('Invalid "characters" parameter');
    }
  }
  const blanksCount = characters.filter((character) => character === BLANK).length;

  if (blanksCount > config.blanksCount) {
    throw new Error('Too many blank tiles passed');
  }

  if (!isBoardJson(boardJson) || !isBoardValid(boardJson, config)) {
    throw new Error('Invalid "board" parameter');
  }

  const board = Board.fromJson(boardJson);

  return {
    board,
    characters,
    config,
    locale,
  };
};

export const config = {
  api: {
    responseLimit: '25mb',
  },
};

export default solve;
