import { logEvent } from '@scrabble-solver/logger';
import { isGame, isLocale, isObject } from '@scrabble-solver/types';
import { type NextApiRequest, type NextApiResponse } from 'next';

import { type ApiContext, withApiLog } from '@/api';

interface RequestData {
  game: string | undefined;
  locale: string | undefined;
  referrer: string | undefined;
}

const REFERRER_MAX_LENGTH = 256;

export default withApiLog('visit', visit);

function visit(request: NextApiRequest, response: NextApiResponse, { ip }: ApiContext) {
  const { game, locale, referrer } = parseRequest(request);
  response.status(200).send(true);
  logEvent({ type: 'visit', ip, ua: request.headers['user-agent'], referrer, locale, game });
}

// A visit is only a ping - unexpected fields are ignored, never rejected.
function parseRequest(request: NextApiRequest): RequestData {
  const body: unknown = request.body;

  if (!isObject(body)) {
    return { game: undefined, locale: undefined, referrer: undefined };
  }

  const { game, locale, referrer } = body;

  return {
    game: isGame(game) ? game : undefined,
    locale: isLocale(locale) ? locale : undefined,
    referrer: typeof referrer === 'string' && referrer.length > 0 ? referrer.slice(0, REFERRER_MAX_LENGTH) : undefined,
  };
}
