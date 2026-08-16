import { type BoardWord, type Locale, type ResultJson } from '@scrabble-solver/types';

import { type SolveRequestPayload, type VerifyRequestPayload } from '@/types';

export interface VerifyResult {
  invalidWords: BoardWord[];
  validWords: BoardWord[];
}

export type SolverWorkerRequest =
  | { id: number; type: 'prefetch'; locale: Locale }
  | { id: number; type: 'solve'; payload: SolveRequestPayload }
  | { id: number; type: 'verify'; payload: VerifyRequestPayload };

export type SolverWorkerResponse =
  | { id: number; outcome: 'answered'; data: ResultJson[] | VerifyResult }
  /** No cached dictionary, or an internal error - the caller falls back to the server. */
  | { id: number; outcome: 'unavailable' }
  /** A newer solve replaced this one - the newer answer is the one worth waiting for. */
  | { id: number; outcome: 'superseded' };
