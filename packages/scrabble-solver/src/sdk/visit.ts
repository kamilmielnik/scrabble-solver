import { type Game, type Locale } from '@scrabble-solver/types';

import { fetchJson } from './fetchJson';

interface Payload {
  game: Game;
  locale: Locale;
  referrer: string;
}

export function visit(payload: Payload): Promise<boolean> {
  return fetchJson<boolean>('/api/visit', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
