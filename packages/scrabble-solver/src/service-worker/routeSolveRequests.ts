import { getConfig } from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import { type Gaddag } from '@scrabble-solver/gaddag';
import { solve } from '@scrabble-solver/solver';
import { Board, Tile } from '@scrabble-solver/types';
import { registerRoute } from 'workbox-routing';

import { type SolveRequestPayload } from '@/types';

import { average } from './average';
import { revalidateDictionary } from './dictionaries';
import { getGaddag } from './getGaddag';

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
};

const MIN_MEASUREMENTS = 5;
const localDurations: number[] = [];
const serverDurations: number[] = [];

export const routeSolveRequests = () => {
  registerRoute(
    ({ url }) => url.origin === location.origin && url.pathname === '/api/solve',
    async ({ request }) => {
      const requestJson: SolveRequestPayload = await request.clone().json();
      const { board, characters, game, locale } = requestJson;

      const solveLocal = async (gaddag: Gaddag): Promise<Response> => {
        const config = getConfig(game, locale);
        const tiles = characters.map((character: string) => new Tile({ character, isBlank: character === BLANK }));

        return new Promise((resolve) => {
          const resultsJson = solve(gaddag, config, Board.fromJson(board), tiles);
          const responseJson = JSON.stringify(resultsJson);
          resolve(new Response(responseJson, { headers }));
        });
      };

      const solveServer = () => fetch(request);

      const gaddag = await getGaddag(locale);

      if (gaddag && typeof isSlowDevice() === 'undefined') {
        const response = await Promise.race([
          (async () => {
            const start = Date.now();
            const result = solveLocal(gaddag);
            localDurations.push(Date.now() - start);
            return result;
          })(),
          (async () => {
            const start = Date.now();
            const result = await solveServer();
            serverDurations.push(Date.now() - start);
            return result;
          })(),
        ]);

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        revalidateDictionary(locale);
        return response;
      }

      const handleSolve = gaddag && !isSlowDevice() ? () => solveLocal(gaddag) : () => solveServer();
      const response = await handleSolve();
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      revalidateDictionary(locale);
      return response;
    },
    'POST',
  );
};

const isSlowDevice = (): boolean | undefined => {
  if (localDurations.length < MIN_MEASUREMENTS || serverDurations.length < MIN_MEASUREMENTS) {
    return undefined;
  }

  const count = Math.min(localDurations.length, serverDurations.length);
  const local = localDurations
    .slice(0, count)
    .sort((a, b) => a - b)
    .slice(1, -1);
  const server = localDurations
    .slice(0, count)
    .sort((a, b) => a - b)
    .slice(1, -1);

  return average(local) > average(server);
};
