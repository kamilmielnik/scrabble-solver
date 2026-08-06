import { Board, type BoardJson, type Locale, Result, type ResultJson } from '@scrabble-solver/types';

import { fetchJson } from './fetchJson';

interface Payload {
  board: BoardJson;
  characters: string[];
  game: string;
  locale: Locale;
}

export const solve = async ({ board, characters, game, locale }: Payload): Promise<Result[]> => {
  const json = await fetchJson<ResultJson[]>('/api/solve', {
    method: 'POST',
    body: JSON.stringify({ board, characters, game, locale }),
  });

  const decodedBoard = Board.fromJson(board);
  return json.map((result) => Result.fromJson(result, decodedBoard));
};
