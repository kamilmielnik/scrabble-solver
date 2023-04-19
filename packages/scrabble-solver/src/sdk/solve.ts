import { BoardJson, Locale, Result, ResultJson } from '@scrabble-solver/types';

import fetchJson from './fetchJson';

interface Payload {
  board: BoardJson;
  characters: string[];
  game: string;
  locale: Locale;
}

const solve = async ({ board, characters, game, locale }: Payload): Promise<Result[]> => {
  const json = await fetchJson<ResultJson[]>('/api/solve', {
    method: 'POST',
    body: JSON.stringify({ board, characters, game, locale }),
  });

  return json.map(Result.fromJson);
};

export default solve;
