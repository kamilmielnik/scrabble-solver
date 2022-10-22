import { getConfig } from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import { solve } from '@scrabble-solver/solver';
import { Board, Locale, Tile } from '@scrabble-solver/types';
import { registerRoute } from 'workbox-routing';

import { revalidateDictionary } from './dictionaries';
import getTrie from './getTrie';

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
};

const routeSolveRequests = () => {
  registerRoute(
    ({ url }) => url.origin === location.origin && url.pathname === '/api/solve',
    async ({ request }) => {
      const { board, characters, configId, locale } = await request.clone().json();
      const trie = await getTrie(locale);

      if (!trie) {
        const response = await fetch(request);
        revalidateDictionary(locale);
        return response;
      }

      const config = getConfig(configId)[locale as Locale];
      const tiles = characters.map((character: string) => new Tile({ character, isBlank: character === BLANK }));
      const resultsJson = solve(trie, config, Board.fromJson(board), tiles);
      const json = JSON.stringify(resultsJson);
      return new Response(json, { headers });
    },
    'POST',
  );
};

export default routeSolveRequests;
