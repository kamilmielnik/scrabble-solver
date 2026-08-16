import { type ResultJson } from '@scrabble-solver/types';
import { afterAll, beforeEach, describe, expect, it } from 'bun:test';

import type * as clientModule from './client';
import { type SolverWorkerRequest, type SolverWorkerResponse, type VerifyResult } from './messages';

type Listener = (event: { data: SolverWorkerResponse }) => void;

const posted: SolverWorkerRequest[] = [];
let listeners: Listener[] = [];
let errorListeners: (() => void)[] = [];
let terminated = 0;
let timeouts: (() => void)[] = [];

class FakeWorker {
  public postMessage(message: SolverWorkerRequest): void {
    posted.push(message);
  }

  public addEventListener(type: string, listener: Listener & (() => void)): void {
    if (type === 'message') {
      listeners.push(listener);
    } else {
      errorListeners.push(listener);
    }
  }

  public terminate(): void {
    terminated += 1;
  }
}

// The client reads these off the global scope on every call, so stubbing them
// here is what makes the worker round-trip and its timeout observable.
const globals = { caches: globalThis.caches, clearTimeout, setTimeout, Worker: globalThis.Worker };

Object.assign(globalThis, {
  caches: {},
  clearTimeout: () => undefined,
  setTimeout: (callback: () => void) => timeouts.push(callback),
  Worker: FakeWorker,
});

afterAll(() => {
  Object.assign(globalThis, globals);
});

const { prefetchDictionary, solveLocally, verifyLocally }: typeof clientModule = await import('./client');

const solvePayload = { board: [], characters: [], game: 'scrabble', locale: 'en-US' } as never;
const verifyPayload = { board: [], game: 'scrabble', locale: 'en-US' } as never;

describe('solver worker client', () => {
  beforeEach(() => {
    posted.length = 0;
    timeouts = [];
  });

  it('resolves a solve with the worker results', async () => {
    const solve = solveLocally(solvePayload);
    respond({ data: createResults('ab'), id: lastRequestId(), outcome: 'answered' });

    expect(await solve).toEqual(createResults('ab'));
  });

  it('resolves to undefined when the worker cannot answer, so the caller falls back to the server', async () => {
    const solve = solveLocally(solvePayload);
    respond({ id: lastRequestId(), outcome: 'unavailable' });

    expect(await solve).toBeUndefined();
  });

  it('answers a superseded solve with the newer solve results', async () => {
    const stale = solveLocally(solvePayload);
    const staleId = lastRequestId();
    const latest = solveLocally(solvePayload);
    const latestId = lastRequestId();

    respond({ id: staleId, outcome: 'superseded' });
    respond({ data: createResults('cd'), id: latestId, outcome: 'answered' });

    expect(await stale).toEqual(createResults('cd'));
    expect(await latest).toEqual(createResults('cd'));
  });

  it('resolves to undefined when the worker never answers', async () => {
    const solve = solveLocally(solvePayload);
    expect(timeouts).toHaveLength(1);
    timeouts[0]();

    expect(await solve).toBeUndefined();
  });

  it('ignores a late answer to a request that already timed out', async () => {
    const solve = solveLocally(solvePayload);
    const id = lastRequestId();
    timeouts[0]();
    respond({ data: createResults('ef'), id, outcome: 'answered' });

    expect(await solve).toBeUndefined();
  });

  it('resolves a verify with the worker words', async () => {
    const verify = verifyLocally(verifyPayload);
    respond({ data: createVerifyResult(), id: lastRequestId(), outcome: 'answered' });

    expect(await verify).toEqual(createVerifyResult());
  });

  it('does not wait for a prefetch to answer', () => {
    prefetchDictionary('pl-PL' as never);

    expect(posted[posted.length - 1].type).toBe('prefetch');
    expect(timeouts).toHaveLength(0);
  });

  it('settles in-flight requests and discards the worker when it fails', async () => {
    const solve = solveLocally(solvePayload);
    const verify = verifyLocally(verifyPayload);
    const failuresBefore = terminated;

    for (const listener of errorListeners) {
      listener();
    }

    expect(await solve).toBeUndefined();
    expect(await verify).toBeUndefined();
    expect(terminated).toBe(failuresBefore + 1);

    listeners = [];
    errorListeners = [];
    const restarted = solveLocally(solvePayload);
    respond({ data: createResults('gh'), id: lastRequestId(), outcome: 'answered' });

    expect(await restarted).toEqual(createResults('gh'));
  });
});

function respond(response: SolverWorkerResponse): void {
  for (const listener of listeners) {
    listener({ data: response });
  }
}

function lastRequestId(): number {
  return posted[posted.length - 1].id;
}

function createResults(word: string): ResultJson[] {
  return [{ blankIndices: [], id: 0, isHorizontal: true, points: 1, tiles: word.split(''), x: 0, y: 0 }];
}

function createVerifyResult(): VerifyResult {
  return {
    invalidWords: [{ direction: 'horizontal', isValid: false, word: 'zz', x: 0, y: 0 }],
    validWords: [{ direction: 'vertical', isValid: true, word: 'ab', x: 3, y: 5 }],
  };
}
