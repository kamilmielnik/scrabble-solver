import { type Locale, type ResultJson } from '@scrabble-solver/types';

import { type SolveRequestPayload, type VerifiedWord, type VerifyRequestPayload } from '@/types';

export interface VerifyResult {
  invalidWords: VerifiedWord[];
  validWords: VerifiedWord[];
}

export type SolverWorkerRequest =
  | { id: number; type: 'prefetch'; locale: Locale }
  | { id: number; type: 'solve'; payload: SolveRequestPayload }
  | { id: number; type: 'verify'; payload: VerifyRequestPayload };

export type SolverWorkerResponse =
  | { id: number; outcome: 'answered'; data: ResultJson[] | VerifyResult }
  /** The server would answer 400 too - the caller fails with its message instead of asking it. */
  | { id: number; outcome: 'rejected'; message: string }
  /** A newer solve replaced this one - the newer answer is the one worth waiting for. */
  | { id: number; outcome: 'superseded' }
  /** No cached dictionary, or an internal error - the caller falls back to the server. */
  | { id: number; outcome: 'unavailable' };
