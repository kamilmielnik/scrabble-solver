import { type Locale, type ResultJson } from '@scrabble-solver/types';

import { type SolveRequestPayload, type VerifyRequestPayload } from '@/types';

import { type SolverWorkerRequest, type SolverWorkerResponse, type VerifyResult } from './messages';

type Resolve = (data: SolverWorkerResponse['data']) => void;

let worker: Worker | undefined;
let nextId = 0;
const pending = new Map<number, Resolve>();

export const solveLocally = async (payload: SolveRequestPayload): Promise<ResultJson[] | undefined> => {
  const data = await request({ id: ++nextId, type: 'solve', payload });
  return data as ResultJson[] | undefined;
};

export const verifyLocally = async (payload: VerifyRequestPayload): Promise<VerifyResult | undefined> => {
  const data = await request({ id: ++nextId, type: 'verify', payload });
  return data as VerifyResult | undefined;
};

export const prefetchDictionary = async (locale: Locale): Promise<void> => {
  getWorker()?.postMessage({ id: ++nextId, locale, type: 'prefetch' } satisfies SolverWorkerRequest);
};

const request = (message: SolverWorkerRequest): Promise<SolverWorkerResponse['data']> => {
  const targetWorker = getWorker();

  if (!targetWorker) {
    return Promise.resolve(undefined);
  }

  return new Promise((resolve) => {
    pending.set(message.id, resolve);
    targetWorker.postMessage(message);
  });
};

const getWorker = (): Worker | undefined => {
  if (typeof Worker === 'undefined' || !('caches' in globalThis)) {
    return undefined;
  }

  if (!worker) {
    worker = new Worker(new URL('./index.worker.ts', import.meta.url));
    worker.addEventListener('message', ({ data }: MessageEvent<SolverWorkerResponse>) => {
      const resolve = pending.get(data.id);
      pending.delete(data.id);
      resolve?.(data.data);
    });
    worker.addEventListener('error', handleWorkerFailure);
  }

  return worker;
};

/**
 * Settles every in-flight request as locally unanswerable - callers fall back
 * to the server - and discards the worker so the next call starts a fresh one.
 */
const handleWorkerFailure = (): void => {
  for (const resolve of pending.values()) {
    resolve(undefined);
  }

  pending.clear();
  worker?.terminate();
  worker = undefined;
};
