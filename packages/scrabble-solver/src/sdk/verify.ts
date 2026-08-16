import { type BoardJson, type BoardWord, type Game, type Locale } from '@scrabble-solver/types';

import { verifyLocally } from '@/solver-worker';

import { fetchJson } from './fetchJson';

interface Payload {
  board: BoardJson;
  game: Game;
  locale: Locale;
}

interface Response {
  invalidWords: BoardWord[];
  validWords: BoardWord[];
}

export const verify = async ({ board, game, locale }: Payload): Promise<Response> => {
  const payload = { board, game, locale };
  return (
    (await verifyLocally(payload)) ??
    fetchJson<Response>('/api/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  );
};
