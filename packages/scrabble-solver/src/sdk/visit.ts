import { type Game, type Locale } from '@scrabble-solver/types';

import { fetchJson } from './fetchJson';

interface Payload {
  referrer: string;
  locale: Locale;
  game: Game;
}

export function visit(payload: Payload): Promise<boolean> {
  return fetchJson<boolean>('/api/visit', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
