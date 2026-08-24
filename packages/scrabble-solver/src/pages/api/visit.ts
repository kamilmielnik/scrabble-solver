import { logEvent } from '@scrabble-solver/logger';
import { isGame, isLocale, isObject } from '@scrabble-solver/types';
import { type NextApiRequest, type NextApiResponse } from 'next';

import { type ApiContext, withApiLog } from '@/api';

interface RequestData {
  referrer: string | undefined;
  locale: string | undefined;
  game: string | undefined;
}

const REFERRER_MAX_LENGTH = 256;

export default withApiLog('visit', visit);

function visit(request: NextApiRequest, response: NextApiResponse, { ip }: ApiContext) {
  const { referrer, locale, game } = parseRequest(request);
  response.status(200).send(true);
  logEvent({ type: 'visit', ip, ua: request.headers['user-agent'], referrer, locale, game });
}

// A visit is only a ping - an unexpected body is ignored, never rejected.
function parseRequest(request: NextApiRequest): RequestData {
  const body: unknown = request.body;

  if (!isObject(body)) {
    return { referrer: undefined, locale: undefined, game: undefined };
  }

  const { referrer, locale, game } = body;

  return {
    referrer: typeof referrer === 'string' && referrer.length > 0 ? referrer.slice(0, REFERRER_MAX_LENGTH) : undefined,
    locale: isLocale(locale) ? locale : undefined,
    game: isGame(game) ? game : undefined,
  };
}
