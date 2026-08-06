/// <reference lib="WebWorker" />

import { getConfig } from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import { solve } from '@scrabble-solver/solver';
import { Board, type Locale, Tile } from '@scrabble-solver/types';

import { type SolveRequestPayload, type VerifyRequestPayload } from '@/types';

import { revalidateDictionary } from './dictionaries';
import { getGaddag } from './getGaddag';
import { type SolverWorkerRequest, type SolverWorkerResponse } from './messages';

declare const self: DedicatedWorkerGlobalScope;

/**
 * Solves run synchronously on the single worker thread, so a burst of requests
 * would queue stale solves ahead of the latest one.
 */
let latestSolveId = 0;

self.addEventListener('message', ({ data }: MessageEvent<SolverWorkerRequest>) => {
  if (data.type === 'solve') {
    latestSolveId = data.id;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    respond(data.id, () => handleSolve(data.id, data.payload));
  } else if (data.type === 'verify') {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    respond(data.id, () => handleVerify(data.id, data.payload));
  } else if (data.type === 'prefetch') {
    prefetchDictionary(data.locale).catch(() => undefined);
  }
});

async function handleSolve(id: number, payload: SolveRequestPayload): Promise<SolverWorkerResponse> {
  const { board, characters, game, locale } = payload;
  const gaddag = await getGaddag(locale);
  revalidateInBackground(locale);

  if (!gaddag) {
    return { id, outcome: 'unavailable' };
  }

  await yieldToQueuedMessages();

  if (latestSolveId !== id) {
    return { id, outcome: 'superseded' };
  }

  const config = getConfig(game, locale);
  const tiles = characters.map((character) => new Tile({ character, isBlank: character === BLANK }));
  return { data: solve(gaddag, config, Board.fromJson(board), tiles), id, outcome: 'answered' };
}

async function handleVerify(
  id: number,
  { board: boardJson, locale }: VerifyRequestPayload,
): Promise<SolverWorkerResponse> {
  const gaddag = await getGaddag(locale);
  revalidateInBackground(locale);

  if (!gaddag) {
    return { id, outcome: 'unavailable' };
  }

  const board = Board.fromJson(boardJson);
  const words = board.getWords().sort((a, b) => a.localeCompare(b, locale));
  const invalidWords: string[] = [];
  const validWords: string[] = [];

  for (const word of words) {
    if (gaddag.has(word)) {
      validWords.push(word);
    } else {
      invalidWords.push(word);
    }
  }

  return { data: { invalidWords, validWords }, id, outcome: 'answered' };
}

/**
 * Deserializes the dictionary ahead of the first solve, so it does not pay the
 * cold-start cost. Warms even when revalidation fails (e.g. offline) - a
 * previously cached dictionary can still be deserialized.
 */
async function prefetchDictionary(locale: Locale): Promise<void> {
  try {
    await revalidateDictionary(locale);
  } catch {
    // Solving falls back to the server until a later revalidation succeeds.
  }

  await getGaddag(locale);
}

/**
 * Revalidation failures are expected (offline, server down) and must not
 * surface as unhandled rejections - solving keeps using the cached dictionary
 * until a later revalidation succeeds.
 */
function revalidateInBackground(locale: Locale): void {
  revalidateDictionary(locale).catch(() => undefined);
}

async function respond(id: number, handle: () => Promise<SolverWorkerResponse>): Promise<void> {
  try {
    self.postMessage(await handle());
  } catch {
    self.postMessage({ id, outcome: 'unavailable' } satisfies SolverWorkerResponse);
  }
}

/**
 * Messages queued behind this handler dispatch only between macrotasks - a
 * MessageChannel round-trip lets them register before an expensive solve.
 */
function yieldToQueuedMessages(): Promise<void> {
  return new Promise((resolve) => {
    const { port1, port2 } = new MessageChannel();
    port1.onmessage = () => resolve();
    port2.postMessage(null);
  });
}
