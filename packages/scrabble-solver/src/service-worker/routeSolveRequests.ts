import { type Trie } from '@kamilmielnik/trie';
import { getConfig } from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import { solve } from '@scrabble-solver/solver';
import { Board, Tile } from '@scrabble-solver/types';
import { registerRoute } from 'workbox-routing';

import { type SolveRequestPayload } from 'types';

import { average } from './average';
import { revalidateDictionary } from './dictionaries';
import { getTrie } from './getTrie';

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
};

const MIN_MEASUREMENTS = 5;
const localDurations: number[] = [];
const serverDurations: number[] = [];

const isSlowDevice = (): boolean | undefined => {
  if (localDurations.length < MIN_MEASUREMENTS || serverDurations.length < MIN_MEASUREMENTS) {
    return undefined;
  }

  const count = Math.min(localDurations.length, serverDurations.length);
  const local = localDurations.slice(0, count).sort().slice(1, -1);
  const server = serverDurations.slice(0, count).sort().slice(1, -1);

  return average(local) > average(server);
};

export const routeSolveRequests = () => {
  registerRoute(
    ({ url }) => url.origin === location.origin && url.pathname === '/api/solve',
    async ({ request }) => {
      const requestJson: SolveRequestPayload = await request.clone().json();
      const { board, characters, game, locale } = requestJson;

      const solveLocal = async (trie: Trie): Promise<Response> => {
        const config = getConfig(game, locale);
        const tiles = characters.map((character: string) => new Tile({ character, isBlank: character === BLANK }));

        return new Promise((resolve) => {
          const resultsJson = solve(trie, config, Board.fromJson(board), tiles);
          const responseJson = JSON.stringify(resultsJson);
          resolve(new Response(responseJson, { headers }));
        });
      };

      const solveServer = () => fetch(request);

      const trie = await getTrie(locale);

      if (trie && typeof isSlowDevice() === 'undefined') {
        const response = await Promise.race([
          (async () => {
            const start = Date.now();
            const result = solveLocal(trie);
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

      const handleSolve = trie && !isSlowDevice() ? () => solveLocal(trie) : () => solveServer();
      const response = await handleSolve();
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      revalidateDictionary(locale);
      return response;
    },
    'POST',
  );
};
