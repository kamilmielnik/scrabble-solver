/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Gaddag } from '@kamilmielnik/gaddag';
import { type ResultJson, Board, Game, Locale } from '@scrabble-solver/types';
import { afterAll, beforeEach, describe, expect, it, mock } from 'bun:test';

import { noop } from '../lib/noop';
import type * as apiVerifyModule from '../pages/api/verify';
import type * as testApiModule from '../test/api';
import { createDeferred, flushMicrotasks } from '../test/async';

import { type SolverWorkerRequest, type SolverWorkerResponse, type VerifyResult } from './messages';

type Listener = (event: { data: SolverWorkerRequest }) => void;

const gaddag = Gaddag.fromArray(['at', 'cat', 'zebra']);
const listeners: Listener[] = [];
const posted: SolverWorkerResponse[] = [];
const getGaddag = mock((_locale: Locale): Promise<Gaddag | undefined> => Promise.resolve(gaddag));
const revalidateDictionary = mock((_locale: Locale): Promise<void> => Promise.resolve());
const selfDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'self');

Object.defineProperty(globalThis, 'self', {
  configurable: true,
  value: {
    addEventListener: (_type: string, listener: Listener) => listeners.push(listener),
    postMessage: (message: SolverWorkerResponse) => posted.push(message),
  },
});

afterAll(() => {
  Object.defineProperty(globalThis, 'self', selfDescriptor!);
});

await mock.module('./getGaddag', () => ({ getGaddag }));
await mock.module('./dictionaries', () => ({ revalidateDictionary }));
await mock.module('@scrabble-solver/dictionaries', () => ({ dictionaries: { get: () => Promise.resolve(gaddag) } }));
await mock.module('@scrabble-solver/logger', () => ({ logError: noop, logEvent: noop }));

await import('./index.worker');

const { default: verifyRoute }: typeof apiVerifyModule = await import('../pages/api/verify');
const { createApiRequest, createApiResponse }: typeof testApiModule = await import('../test/api');

const emptyBoard = Board.create(15, 15).toJson();
const solvePayload = { board: emptyBoard, characters: ['c', 'a', 't'], game: Game.Scrabble, locale: Locale.EN_US };
const verifyPayload = { board: emptyBoard, game: Game.Scrabble, locale: Locale.EN_US };

let nextId = 0;

beforeEach(() => {
  posted.length = 0;
  getGaddag.mockClear();
  revalidateDictionary.mockClear();
  getGaddag.mockImplementation(() => Promise.resolve(gaddag));
  revalidateDictionary.mockImplementation(() => Promise.resolve());
});

describe('solve', () => {
  it('answers with the moves for the payload', async () => {
    const id = ++nextId;

    dispatch({ id, payload: solvePayload, type: 'solve' });
    const response = await waitForResponse(id);

    expect(response.outcome).toBe('answered');
    expect(readWords(response)).toContain('cat');
  });

  it('marks blanks in the rack as blank tiles', async () => {
    const id = ++nextId;

    dispatch({ id, payload: { ...solvePayload, characters: [' ', 'a', 't'] }, type: 'solve' });
    const response = await waitForResponse(id);

    expect(readResults(response).some((result) => result.blankIndices.length === 1)).toBe(true);
  });

  it('revalidates the dictionary in the background', async () => {
    const id = ++nextId;

    dispatch({ id, payload: solvePayload, type: 'solve' });
    await waitForResponse(id);

    expect(revalidateDictionary).toHaveBeenCalledWith(Locale.EN_US);
  });

  it('answers unavailable without a cached dictionary, so the client falls back to the server', async () => {
    getGaddag.mockImplementation(() => Promise.resolve(undefined));
    const id = ++nextId;

    dispatch({ id, payload: solvePayload, type: 'solve' });

    expect(await waitForResponse(id)).toEqual({ id, outcome: 'unavailable' });
  });

  it('skips a solve replaced by a newer one while waiting', async () => {
    const [first, second] = [++nextId, ++nextId];

    dispatch({ id: first, payload: solvePayload, type: 'solve' });
    dispatch({ id: second, payload: solvePayload, type: 'solve' });

    expect(await waitForResponse(first)).toEqual({ id: first, outcome: 'superseded' });
    expect((await waitForResponse(second)).outcome).toBe('answered');
  });

  it('answers unavailable when solving throws', async () => {
    const id = ++nextId;

    dispatch({ id, payload: { ...solvePayload, game: 'chess' as Game }, type: 'solve' });

    expect(await waitForResponse(id)).toEqual({ id, outcome: 'unavailable' });
  });

  it('answers unavailable when reading the dictionary throws', async () => {
    getGaddag.mockImplementation(() => Promise.reject(new Error('cache broken')));
    const id = ++nextId;

    dispatch({ id, payload: solvePayload, type: 'solve' });

    expect(await waitForResponse(id)).toEqual({ id, outcome: 'unavailable' });
  });

  it('swallows a failed background revalidation', async () => {
    revalidateDictionary.mockImplementation(() => Promise.reject(new Error('offline')));
    const id = ++nextId;

    dispatch({ id, payload: solvePayload, type: 'solve' });

    expect((await waitForResponse(id)).outcome).toBe('answered');
  });
});

describe('verify', () => {
  it('splits words into valid and invalid with their location', async () => {
    const id = ++nextId;

    dispatch({ id, payload: { ...verifyPayload, board: createBoard('cat', 'dog') }, type: 'verify' });

    expect(await waitForResponse(id)).toEqual({
      data: {
        invalidWords: [{ direction: 'horizontal', isValid: false, word: 'dog', x: 0, y: 2 }],
        validWords: [{ direction: 'horizontal', isValid: true, word: 'cat', x: 0, y: 0 }],
      },
      id,
      outcome: 'answered',
    });
  });

  it('answers unavailable without a cached dictionary', async () => {
    getGaddag.mockImplementation(() => Promise.resolve(undefined));
    const id = ++nextId;

    dispatch({ id, payload: verifyPayload, type: 'verify' });

    expect(await waitForResponse(id)).toEqual({ id, outcome: 'unavailable' });
    expect(revalidateDictionary).toHaveBeenCalledWith(Locale.EN_US);
  });

  it.each([
    ['an empty board', []],
    ['a board with valid and invalid words', ['zebra', 'dog', 'cat', 'dog']],
    ['words needing a sort', ['zebra', 'cat']],
  ])('answers exactly like /api/verify for %s', async (_name, words) => {
    const id = ++nextId;
    const board = createBoard(...words);
    const response = createApiResponse();

    await verifyRoute(createApiRequest({ body: { ...verifyPayload, board } }), response);
    dispatch({ id, payload: { ...verifyPayload, board }, type: 'verify' });
    const answer = await waitForResponse(id);

    expect((answer as { data: VerifyResult }).data).toEqual(response.body as VerifyResult);
  });
});

describe('prefetch', () => {
  it('revalidates and then deserializes the dictionary', async () => {
    const order: string[] = [];
    revalidateDictionary.mockImplementation(async () => {
      order.push('revalidate');
    });
    getGaddag.mockImplementation(async () => {
      order.push('deserialize');
      return gaddag;
    });

    dispatch({ id: ++nextId, locale: Locale.PL_PL, type: 'prefetch' });
    await flushMicrotasks();

    expect(order).toEqual(['revalidate', 'deserialize']);
    expect(getGaddag).toHaveBeenCalledWith(Locale.PL_PL);
    expect(posted).toEqual([]);
  });

  it('warms the cached dictionary even when revalidation fails offline', async () => {
    revalidateDictionary.mockImplementation(() => Promise.reject(new Error('offline')));

    dispatch({ id: ++nextId, locale: Locale.PL_PL, type: 'prefetch' });
    await flushMicrotasks();

    expect(getGaddag).toHaveBeenCalledWith(Locale.PL_PL);
  });

  it('does not surface a failure to deserialize', async () => {
    const { promise, reject } = createDeferred<Gaddag | undefined>();
    getGaddag.mockImplementation(() => promise);

    dispatch({ id: ++nextId, locale: Locale.PL_PL, type: 'prefetch' });
    await flushMicrotasks();
    reject(new Error('broken'));
    await flushMicrotasks();

    expect(posted).toEqual([]);
  });
});

function dispatch(data: SolverWorkerRequest): void {
  for (const listener of listeners) {
    listener({ data });
  }
}

async function waitForResponse(id: number): Promise<SolverWorkerResponse> {
  while (!posted.some((response) => response.id === id)) {
    await new Promise((resolve) => setImmediate(resolve));
  }

  return posted.find((response) => response.id === id)!;
}

function readResults(response: SolverWorkerResponse): ResultJson[] {
  return (response as { data: ResultJson[] }).data;
}

function readWords(response: SolverWorkerResponse): string[] {
  return readResults(response).map((result) => result.tiles.join(''));
}

function createBoard(...words: string[]) {
  const rows = Array<string>(15).fill(' '.repeat(15));

  words.forEach((word, index) => {
    rows[index * 2] = word.padEnd(15, ' ');
  });

  return Board.fromStringArray(rows).toJson();
}
