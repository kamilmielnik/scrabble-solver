import { type BoardJson, type Game, type Locale } from '@scrabble-solver/types';

import { verifyLocally } from '@/solver-worker';
import { type VerifiedWord } from '@/types';

import { fetchJson } from './fetchJson';

interface Payload {
  board: BoardJson;
  game: Game;
  locale: Locale;
}

interface Response {
  invalidWords: VerifiedWord[];
  validWords: VerifiedWord[];
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
