import { Board, type BoardJson, type Game, type Locale, Result, type ResultJson } from '@scrabble-solver/types';

import { solveLocally } from '@/solver-worker';

import { fetchJson } from './fetchJson';

interface Payload {
  board: BoardJson;
  characters: string[];
  game: Game;
  locale: Locale;
}

export const solve = async ({ board, characters, game, locale }: Payload): Promise<Result[]> => {
  const payload = { board, characters, game, locale };
  const json =
    (await solveLocally(payload)) ??
    (await fetchJson<ResultJson[]>('/api/solve', {
      method: 'POST',
      body: JSON.stringify(payload),
    }));

  const decodedBoard = Board.fromJson(board);
  return json.map((result) => Result.fromJson(result, decodedBoard));
};
