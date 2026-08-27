import { getConfig, hasConfig } from '@scrabble-solver/configs';
import { dictionaries } from '@scrabble-solver/dictionaries';
import { logEvent } from '@scrabble-solver/logger';
import { Board, type Config, type Game, type Locale, isBoardJson, isGame, isLocale } from '@scrabble-solver/types';
import { type NextApiRequest, type NextApiResponse } from 'next';

import { type ApiContext, BadRequestError, isBoardValid, withApiLog } from '@/api';
import { type VerifiedWord } from '@/types';

interface RequestData {
  board: Board;
  config: Config;
  game: Game;
  locale: Locale;
}

export default withApiLog('verify', verify);

async function verify(request: NextApiRequest, response: NextApiResponse, { ip, getElapsedMs }: ApiContext) {
  const { board, game, locale } = parseRequest(request);
  const gaddag = await dictionaries.get(locale);
  const words = board.getWords().sort((a, b) => a.word.localeCompare(b.word, locale));
  const invalidWords: VerifiedWord[] = [];
  const validWords: VerifiedWord[] = [];

  for (const word of words) {
    if (gaddag.has(word.word)) {
      validWords.push({ ...word, isValid: true });
    } else {
      invalidWords.push({ ...word, isValid: false });
    }
  }

  response.status(200).send({ invalidWords, validWords });

  logEvent({
    type: 'verify',
    ip,
    ms: getElapsedMs(),
    locale,
    game,
    tiles: board.getTilesCount(),
    blanks: board.getBlanksCount(),
    valid: validWords.length,
    invalid: invalidWords.length,
  });
}

function parseRequest(request: NextApiRequest): RequestData {
  const { board: boardJson, game, locale } = request.body;

  if (!isLocale(locale)) {
    throw new BadRequestError('Invalid "locale" parameter');
  }

  if (!isGame(game)) {
    throw new BadRequestError('Invalid "game" parameter');
  }

  if (!hasConfig(game, locale)) {
    throw new BadRequestError(`No game "${game}" in "${locale}"`);
  }

  const config = getConfig(game, locale);

  if (!isBoardJson(boardJson) || !isBoardValid(boardJson, config)) {
    throw new BadRequestError('Invalid "board" parameter');
  }

  const board = Board.fromJson(boardJson);

  return {
    board,
    config,
    game,
    locale,
  };
}
