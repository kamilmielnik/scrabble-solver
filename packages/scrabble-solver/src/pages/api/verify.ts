import { getLocaleConfig, isConfigId } from '@scrabble-solver/configs';
import { dictionaries } from '@scrabble-solver/dictionaries';
import logger from '@scrabble-solver/logger';
import { Board, Config, isBoardJson, isLocale, Locale } from '@scrabble-solver/types';
import { NextApiRequest, NextApiResponse } from 'next';

import { getServerLoggingData, isBoardValid } from 'api';

interface RequestData {
  board: Board;
  config: Config;
  locale: Locale;
}

const verify = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
  const meta = getServerLoggingData(request);

  try {
    const { board, locale } = parseRequest(request);

    logger.info('verify - request', {
      meta,
      payload: {
        board: board.toString(),
        boardBlanksCount: board.getBlanksCount(),
        boardTilesCount: board.getTilesCount(),
        configId: request.body.configId,
        locale,
      },
    });

    const trie = await dictionaries.get(locale);
    const words = board.getWords().sort((a, b) => a.localeCompare(b, locale));
    const invalidWords = words.filter((word) => !trie.has(word));
    const validWords = words.filter((word) => trie.has(word));
    response.status(200).send({ invalidWords, validWords });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error('verify - error', { error, meta });
    response.status(500).send({ error: 'Server error', message });
    throw error;
  }
};

const parseRequest = (request: NextApiRequest): RequestData => {
  const { board: boardJson, configId, locale } = request.body;

  if (!isLocale(locale)) {
    throw new Error('Invalid "locale" parameter');
  }

  if (!isConfigId(configId)) {
    throw new Error('Invalid "configId" parameter');
  }

  const config = getLocaleConfig(configId, locale);

  if (!isBoardJson(boardJson) || !isBoardValid(boardJson, config)) {
    throw new Error('Invalid "board" parameter');
  }

  const board = Board.fromJson(boardJson);

  return {
    board,
    config,
    locale,
  };
};

export default verify;
