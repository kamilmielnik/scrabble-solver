import { Board, Result, type ResultJson } from '@scrabble-solver/types';

import { solveLocally } from '@/solver-worker';
import { type SolveRequestPayload } from '@/types';

import { fetchJson } from './fetchJson';

export const solve = async (payload: SolveRequestPayload): Promise<Result[]> => {
  const { board } = payload;
  const json =
    (await solveLocally(payload)) ??
    (await fetchJson<ResultJson[]>('/api/solve', {
      method: 'POST',
      body: JSON.stringify(payload),
    }));

  const decodedBoard = Board.fromJson(board);
  return json.map((result) => Result.fromJson(result, decodedBoard));
};
