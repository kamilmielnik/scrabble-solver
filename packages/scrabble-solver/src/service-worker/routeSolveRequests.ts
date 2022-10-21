import { getConfig } from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import { solve } from '@scrabble-solver/solver';
import { Board, Locale, Tile } from '@scrabble-solver/types';
import { registerRoute } from 'workbox-routing';

import { getDictionary } from './dictionaries';

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
};

const routeSolveRequests = () => {
  registerRoute(
    ({ url }) => url.pathname === '/api/solve',
    async ({ request }) => {
      const { board, characters, configId, locale } = await request.clone().json();
      const trie = getDictionary(locale);

      if (!trie) {
        return fetch(request);
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
