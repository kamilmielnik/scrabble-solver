import { logEvent } from '@scrabble-solver/logger';
import { isGame, isLocale, isObject } from '@scrabble-solver/types';
import { type NextApiRequest, type NextApiResponse } from 'next';

import { type ApiContext, withApiLog } from '@/api';

interface RequestData {
  game: string | undefined;
  locale: string | undefined;
  referrer: string | undefined;
  url: string | undefined;
}

const URL_MAX_LENGTH = 256;

export default withApiLog('visit', visit);

function visit(request: NextApiRequest, response: NextApiResponse, { ip, ua }: ApiContext) {
  const { game, locale, referrer, url } = parseRequest(request);
  response.status(200).send(true);
  logEvent({ type: 'visit', ip, ua, referrer, locale, game, url });
}

// A visit is only a ping - unexpected fields are ignored, never rejected.
function parseRequest(request: NextApiRequest): RequestData {
  const body: unknown = request.body;

  if (!isObject(body)) {
    return { game: undefined, locale: undefined, referrer: undefined, url: undefined };
  }

  const { game, locale, referrer, url } = body;

  return {
    game: isGame(game) ? game : undefined,
    locale: isLocale(locale) ? locale : undefined,
    referrer: parseUrl(referrer),
    url: parseUrl(url),
  };
}

function parseUrl(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value.slice(0, URL_MAX_LENGTH) : undefined;
}
