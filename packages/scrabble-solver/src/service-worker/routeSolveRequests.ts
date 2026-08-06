import { type Gaddag } from '@kamilmielnik/gaddag';
import { getConfig } from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import { solve } from '@scrabble-solver/solver';
import { Board, Tile } from '@scrabble-solver/types';
import { registerRoute } from 'workbox-routing';

import { type SolveRequestPayload } from '@/types';

import { revalidateDictionary } from './dictionaries';
import { getGaddag } from './getGaddag';

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
};

// Solves run synchronously on the single worker thread, so a burst of edits
// would queue stale solves ahead of the latest one. Each request bumps its
// client's id before any await; a handler that finds a newer id when it is
// about to solve answers with an empty result instead, which the page's
// takeLatest has already abandoned.
const latestRequestIds = new Map<string, number>();

export const routeSolveRequests = () => {
  registerRoute(
    ({ url }) => url.origin === location.origin && url.pathname === '/api/solve',
    async ({ event, request }) => {
      const { clientId } = event as FetchEvent;
      const requestId = (latestRequestIds.get(clientId) ?? 0) + 1;
      latestRequestIds.set(clientId, requestId);

      const requestJson: SolveRequestPayload = await request.clone().json();
      const gaddag = await getGaddag(requestJson.locale);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      revalidateDictionary(requestJson.locale);

      if (!gaddag) {
        return fetch(request);
      }

      if (latestRequestIds.get(clientId) !== requestId) {
        return new Response('[]', { headers });
      }

      return solveLocal(gaddag, requestJson);
    },
    'POST',
  );
};

const solveLocal = (gaddag: Gaddag, { board, characters, game, locale }: SolveRequestPayload): Response => {
  const config = getConfig(game, locale);
  const tiles = characters.map((character: string) => new Tile({ character, isBlank: character === BLANK }));
  const resultsJson = solve(gaddag, config, Board.fromJson(board), tiles);
  return new Response(JSON.stringify(resultsJson), { headers });
};
