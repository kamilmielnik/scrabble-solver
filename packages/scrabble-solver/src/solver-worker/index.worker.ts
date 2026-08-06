/// <reference lib="WebWorker" />

import { getConfig } from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import { solve } from '@scrabble-solver/solver';
import { Board, type Locale, type ResultJson, Tile } from '@scrabble-solver/types';

import { type SolveRequestPayload, type VerifyRequestPayload } from '@/types';

import { revalidateDictionary } from './dictionaries';
import { getGaddag } from './getGaddag';
import { type SolverWorkerRequest, type VerifyResult } from './messages';

declare const self: DedicatedWorkerGlobalScope;

/**
 * Solves run synchronously on the single worker thread, so a burst of
 * requests would queue stale solves ahead of the latest one. Handlers note the
 * newest solve id at dispatch; a solve that is no longer the newest after
 * yielding to the event loop answers with an empty result instead, which the
 * page's takeLatest has already abandoned.
 */
let latestSolveId = 0;

self.addEventListener('message', ({ data }: MessageEvent<SolverWorkerRequest>) => {
  if (data.type === 'solve') {
    latestSolveId = data.id;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    respond(data.id, () => handleSolve(data.id, data.payload));
  } else if (data.type === 'verify') {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    respond(data.id, () => handleVerify(data.payload));
  } else if (data.type === 'prefetch') {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    prefetchDictionary(data.locale);
  }
});

const handleSolve = async (
  id: number,
  { board, characters, game, locale }: SolveRequestPayload,
): Promise<ResultJson[] | undefined> => {
  const gaddag = await getGaddag(locale);
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  revalidateDictionary(locale);

  if (!gaddag) {
    return undefined;
  }

  await yieldToQueuedMessages();

  if (latestSolveId !== id) {
    return [];
  }

  const config = getConfig(game, locale);
  const tiles = characters.map((character) => new Tile({ character, isBlank: character === BLANK }));
  return solve(gaddag, config, Board.fromJson(board), tiles);
};

const handleVerify = async ({ board: boardJson, locale }: VerifyRequestPayload): Promise<VerifyResult | undefined> => {
  const gaddag = await getGaddag(locale);
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  revalidateDictionary(locale);

  if (!gaddag) {
    return undefined;
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

  return { invalidWords, validWords };
};

/**
 * Deserializes the dictionary ahead of the first solve, so it does not pay the
 * cold-start cost. Warms even when revalidation fails (e.g. offline) - a
 * previously cached dictionary can still be deserialized.
 */
const prefetchDictionary = async (locale: Locale): Promise<void> => {
  try {
    await revalidateDictionary(locale);
  } catch {
    // Solving falls back to the server until a later revalidation succeeds.
  } finally {
    await getGaddag(locale);
  }
};

const respond = async (id: number, handle: () => Promise<ResultJson[] | VerifyResult | undefined>): Promise<void> => {
  try {
    self.postMessage({ data: await handle(), id });
  } catch {
    self.postMessage({ data: undefined, id });
  }
};

/**
 * Messages queued behind this handler dispatch only between macrotasks - a
 * MessageChannel round-trip lets them register before an expensive solve.
 */
const yieldToQueuedMessages = (): Promise<void> => {
  return new Promise((resolve) => {
    const { port1, port2 } = new MessageChannel();
    port1.onmessage = () => resolve();
    port2.postMessage(null);
  });
};
