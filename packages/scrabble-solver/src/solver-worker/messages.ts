import { type Locale, type ResultJson } from '@scrabble-solver/types';

import { type SolveRequestPayload, type VerifyRequestPayload } from '@/types';

export interface VerifyResult {
  invalidWords: string[];
  validWords: string[];
}

export type SolverWorkerRequest =
  | { id: number; type: 'prefetch'; locale: Locale }
  | { id: number; type: 'solve'; payload: SolveRequestPayload }
  | { id: number; type: 'verify'; payload: VerifyRequestPayload };

/**
 * `data` is undefined when the worker cannot answer locally (no cached
 * dictionary, or an internal error) - the caller falls back to the server
 * while the worker downloads the dictionary in the background.
 */
export interface SolverWorkerResponse {
  data: ResultJson[] | VerifyResult | undefined;
  id: number;
}
