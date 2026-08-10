import { type Locale, type ResultJson } from '@scrabble-solver/types';

import { type SolveRequestPayload, type VerifyRequestPayload } from '@/types';

import { type SolverWorkerRequest, type SolverWorkerResponse, type VerifyResult } from './messages';

/**
 * A worker that never answers - killed under memory pressure, or a message lost
 * with it - must not hold the UI in a loading state with no server fallback.
 */
const REQUEST_TIMEOUT = 30 * 1000;

interface PendingRequest {
  resolve: (response: SolverWorkerResponse) => void;
  timeout: ReturnType<typeof setTimeout>;
}

let worker: Worker | undefined;
let nextId = 0;
let latestSolveId = 0;
let latestSolve: Promise<ResultJson[] | undefined> = Promise.resolve(undefined);
const pending = new Map<number, PendingRequest>();

export function solveLocally(payload: SolveRequestPayload): Promise<ResultJson[] | undefined> {
  const id = ++nextId;
  const solve = readSolveResponse(id, payload);
  latestSolveId = id;
  latestSolve = solve;
  return solve;
}

export async function verifyLocally(payload: VerifyRequestPayload): Promise<VerifyResult | undefined> {
  const response = await request({ id: ++nextId, type: 'verify', payload });
  return response.outcome === 'answered' ? (response.data as VerifyResult) : undefined;
}

export function prefetchDictionary(locale: Locale): void {
  getWorker()?.postMessage({ id: ++nextId, locale, type: 'prefetch' } satisfies SolverWorkerRequest);
}

async function readSolveResponse(id: number, payload: SolveRequestPayload): Promise<ResultJson[] | undefined> {
  const response = await request({ id, type: 'solve', payload });

  /**
   * The worker skipped this solve for a newer one; answer with the newer result
   * rather than an empty list a caller could render as "no moves found".
   */
  if (response.outcome === 'superseded' && id !== latestSolveId) {
    return latestSolve;
  }

  return response.outcome === 'answered' ? (response.data as ResultJson[]) : undefined;
}

function request(message: SolverWorkerRequest): Promise<SolverWorkerResponse> {
  const targetWorker = getWorker();

  if (!targetWorker) {
    return Promise.resolve({ id: message.id, outcome: 'unavailable' });
  }

  return new Promise((resolve) => {
    const timeout = setTimeout(() => settle({ id: message.id, outcome: 'unavailable' }), REQUEST_TIMEOUT);
    pending.set(message.id, { resolve, timeout });
    targetWorker.postMessage(message);
  });
}

function settle(response: SolverWorkerResponse): void {
  const entry = pending.get(response.id);

  if (!entry) {
    return;
  }

  pending.delete(response.id);
  clearTimeout(entry.timeout);
  entry.resolve(response);
}

function getWorker(): Worker | undefined {
  if (typeof Worker === 'undefined' || !('caches' in globalThis)) {
    return undefined;
  }

  if (!worker) {
    worker = new Worker(new URL('./index.worker.ts', import.meta.url));
    worker.addEventListener('message', ({ data }: MessageEvent<SolverWorkerResponse>) => settle(data));
    worker.addEventListener('error', handleWorkerFailure);
  }

  return worker;
}

/**
 * Settles every in-flight request as locally unanswerable - callers fall back
 * to the server - and discards the worker so the next call starts a fresh one.
 */
function handleWorkerFailure(): void {
  for (const id of pending.keys()) {
    settle({ id, outcome: 'unavailable' });
  }

  worker?.terminate();
  worker = undefined;
}
