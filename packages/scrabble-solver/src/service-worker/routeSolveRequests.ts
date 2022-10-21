import { Trie } from '@kamilmielnik/trie';
import { getConfig } from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import { solve } from '@scrabble-solver/solver';
import { Board, Locale, Tile } from '@scrabble-solver/types';
import { registerRoute } from 'workbox-routing';

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
};

const routeSolveRequests = () => {
  registerRoute(
    ({ url }) => url.pathname === '/api/solve',
    async ({ request }) => {
      const { board, characters, configId, locale } = await request.clone().json();
      const trie = getTrie(locale);

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

const cache: Partial<Record<Locale, Trie | Promise<Trie> | undefined>> = {};

const getTrie = (locale: Locale): Trie | undefined => {
  const cached = cache[locale];

  if (cached) {
    if (cached instanceof Promise) {
      return undefined;
    }

    return cached;
  }

  const promise = fetchTrie(locale);
  cache[locale] = promise;
  promise
    .then((trie) => {
      cache[locale] = trie;
    })
    .catch(() => {
      cache[locale] = undefined;
    });

  return undefined;
};

const fetchTrie = async (locale: Locale): Promise<Trie> => {
  const response = await fetch(`/api/dictionary/${locale}`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const serialized = await response.text();
  const trie = Trie.deserialize(serialized);
  return trie;
};

export default routeSolveRequests;
