import { getConfig } from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import { solve } from '@scrabble-solver/solver';
import { Board, Locale, Tile } from '@scrabble-solver/types';
import { registerRoute } from 'workbox-routing';

import average from './average';
import { revalidateDictionary } from './dictionaries';
import getTrie from './getTrie';

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
  return average(localDurations.slice(0, count)) > average(serverDurations.slice(0, count));
};

const routeSolveRequests = () => {
  registerRoute(
    ({ url }) => url.origin === location.origin && url.pathname === '/api/solve',
    async ({ request }) => {
      const { board, characters, configId, locale } = await request.clone().json();
      const trie = await getTrie(locale);
      const shouldMeasure = trie && typeof isSlowDevice() === 'undefined';

      if (trie && !isSlowDevice()) {
        const start = Date.now();
        const config = getConfig(configId)[locale as Locale];
        const tiles = characters.map((character: string) => new Tile({ character, isBlank: character === BLANK }));
        const resultsJson = solve(trie, config, Board.fromJson(board), tiles);
        const json = JSON.stringify(resultsJson);

        if (shouldMeasure) {
          localDurations.push(Date.now() - start);
        }

        if (isSlowDevice() === false) {
          return new Response(json, { headers });
        }
      }

      const start = Date.now();
      const response = await fetch(request);

      if (shouldMeasure) {
        serverDurations.push(Date.now() - start);
      }

      revalidateDictionary(locale);
      return response;
    },
    'POST',
  );
};

export default routeSolveRequests;
