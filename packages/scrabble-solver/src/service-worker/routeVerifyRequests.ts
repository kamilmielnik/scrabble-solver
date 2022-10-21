import { Board } from '@scrabble-solver/types';
import { registerRoute } from 'workbox-routing';

import { getDictionary } from './dictionaries';

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
};

const routeVerifyRequests = () => {
  registerRoute(
    ({ url }) => url.pathname === '/api/verify',
    async ({ request }) => {
      const { board: boardJson, locale } = await request.clone().json();
      const dictionary = getDictionary(locale);

      if (!dictionary) {
        return fetch(request);
      }

      const board = Board.fromJson(boardJson);
      const words = board.getWords().sort((a, b) => a.localeCompare(b));
      const invalidWords = words.filter((word) => !dictionary.has(word));
      const validWords = words.filter((word) => dictionary.has(word));
      const json = JSON.stringify({ invalidWords, validWords });
      return new Response(json, { headers });
    },
    'POST',
  );
};

export default routeVerifyRequests;
