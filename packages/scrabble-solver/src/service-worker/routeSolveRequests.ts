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

export const routeSolveRequests = () => {
  registerRoute(
    ({ url }) => url.origin === location.origin && url.pathname === '/api/solve',
    async ({ request }) => {
      const requestJson: SolveRequestPayload = await request.clone().json();
      const gaddag = await getGaddag(requestJson.locale);
      const response = gaddag ? solveLocal(gaddag, requestJson) : await fetch(request);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      revalidateDictionary(requestJson.locale);
      return response;
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
