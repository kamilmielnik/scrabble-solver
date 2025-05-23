import { getConfig, hasConfig } from '@scrabble-solver/configs';
import { dictionaries } from '@scrabble-solver/dictionaries';
import { logger } from '@scrabble-solver/logger';
import { Board, type Config, type Game, type Locale, isBoardJson, isGame, isLocale } from '@scrabble-solver/types';
import { type NextApiRequest, type NextApiResponse } from 'next';

import { getServerLoggingData, isBoardValid } from 'api';

interface RequestData {
  board: Board;
  config: Config;
  game: Game;
  locale: Locale;
}

const verify = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
  const meta = getServerLoggingData(request);

  try {
    const { board, game, locale } = parseRequest(request);

    logger.info('verify - request', {
      meta,
      payload: {
        board: board.toString(),
        boardBlanksCount: board.getBlanksCount(),
        boardTilesCount: board.getTilesCount(),
        game,
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
  }
};

const parseRequest = (request: NextApiRequest): RequestData => {
  const { board: boardJson, game, locale } = request.body;

  if (!isLocale(locale)) {
    throw new Error('Invalid "locale" parameter');
  }

  if (!isGame(game)) {
    throw new Error('Invalid "game" parameter');
  }

  if (!hasConfig(game, locale)) {
    throw new Error(`No game "${game}" in "${locale}"`);
  }

  const config = getConfig(game, locale);

  if (!isBoardJson(boardJson) || !isBoardValid(boardJson, config)) {
    throw new Error('Invalid "board" parameter');
  }

  const board = Board.fromJson(boardJson);

  return {
    board,
    config,
    game,
    locale,
  };
};

export default verify;
