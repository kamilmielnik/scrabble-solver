import { Board } from '@scrabble-solver/types';
import { registerRoute } from 'workbox-routing';

import { VerifyRequestPayload } from 'types';

import { revalidateDictionary } from './dictionaries';
import { getTrie } from './getTrie';

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
};

export const routeVerifyRequests = () => {
  registerRoute(
    ({ url }) => url.origin === location.origin && url.pathname === '/api/verify',
    async ({ request }) => {
      const requestJson: VerifyRequestPayload = await request.clone().json();
      const { board: boardJson, locale } = requestJson;
      const trie = await getTrie(locale);

      if (!trie) {
        const response = await fetch(request);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        revalidateDictionary(locale);
        return response;
      }

      const board = Board.fromJson(boardJson);
      const words = board.getWords().sort((a, b) => a.localeCompare(b, locale));
      const invalidWords = words.filter((word) => !trie.has(word));
      const validWords = words.filter((word) => trie.has(word));
      const json = JSON.stringify({ invalidWords, validWords });
      return new Response(json, { headers });
    },
    'POST',
  );
};
