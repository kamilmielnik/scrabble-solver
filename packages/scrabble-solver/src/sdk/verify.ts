import { type BoardJson, type Locale } from '@scrabble-solver/types';

import { fetchJson } from './fetchJson';

interface Payload {
  board: BoardJson;
  game: string;
  locale: Locale;
}

interface Response {
  invalidWords: string[];
  validWords: string[];
}

export const verify = async ({ board, game, locale }: Payload): Promise<Response> => {
  return fetchJson<Response>('/api/verify', {
    method: 'POST',
    body: JSON.stringify({ board, game, locale }),
  });
};
