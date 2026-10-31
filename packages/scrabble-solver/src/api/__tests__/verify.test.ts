/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Gaddag } from '@kamilmielnik/gaddag';
import { Board, Game, Locale } from '@scrabble-solver/types';
import { beforeEach, describe, expect, it, mock } from 'bun:test';

import { noop } from '../../lib/noop';
import type * as apiVerifyModule from '../../pages/api/verify';
import type * as testApiModule from '../../test/api';

const logEvent = mock<(event: Record<string, unknown>) => void>();
const get = mock((_locale: Locale): Promise<Gaddag> => Promise.resolve(Gaddag.fromArray(['cat', 'zebra'])));

await mock.module('@scrabble-solver/logger', () => ({ logError: noop, logEvent }));
await mock.module('@scrabble-solver/dictionaries', () => ({ dictionaries: { get } }));

const { default: handler }: typeof apiVerifyModule = await import('../../pages/api/verify');
const { createApiRequest, createApiResponse }: typeof testApiModule = await import('../../test/api');

const emptyBoard = Board.create(15, 15).toJson();
const validBody = { board: emptyBoard, game: Game.Scrabble, locale: Locale.EN_US };

beforeEach(() => {
  logEvent.mockClear();
  get.mockClear();
});

describe('/api/verify', () => {
  it('answers with no words for an empty board', async () => {
    const response = await verify(validBody);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ invalidWords: [], validWords: [] });
  });

  it('splits board words into valid and invalid, keeping their location', async () => {
    const response = await verify({ ...validBody, board: createBoard('cat', 'dog') });

    expect(response.body).toEqual({
      invalidWords: [{ direction: 'horizontal', isValid: false, word: 'dog', x: 0, y: 2 }],
      validWords: [{ direction: 'horizontal', isValid: true, word: 'cat', x: 0, y: 0 }],
    });
  });

  it('sorts words alphabetically in the locale', async () => {
    const response = await verify({ ...validBody, board: createBoard('zebra', 'cat') });
    const { validWords } = response.body as { validWords: { word: string }[] };

    expect(validWords.map(({ word }) => word)).toEqual(['cat', 'zebra']);
  });

  it('logs the outcome', async () => {
    await verify({ ...validBody, board: createBoard('cat', 'dog') });

    expect(logEvent.mock.calls[0][0]).toMatchObject({
      blanks: 0,
      game: Game.Scrabble,
      invalid: 1,
      locale: Locale.EN_US,
      tiles: 6,
      type: 'verify',
      valid: 1,
    });
  });

  it.each([
    ['locale', { locale: 1 }, 'Invalid "locale" parameter'],
    ['game', { game: null }, 'Invalid "game" parameter'],
    ['a game outside the locale', { game: Game.Wyrazy }, 'No game "wyrazy" in "en-US"'],
    ['a malformed board', { board: [[1]] }, 'Invalid "board" parameter'],
    ['a badly sized board', { board: Board.create(14, 15).toJson() }, 'Invalid "board" parameter'],
  ])('rejects %s with 400', async (_name, overrides, message) => {
    const response = await verify({ ...validBody, ...overrides });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: 'Bad request', message });
  });
});

async function verify(body: unknown) {
  const response = createApiResponse();
  await handler(createApiRequest({ body }), response);
  return response;
}

function createBoard(...words: string[]) {
  const rows = Array<string>(15).fill(' '.repeat(15));

  words.forEach((word, index) => {
    rows[index * 2] = word.padEnd(15, ' ');
  });

  return Board.fromStringArray(rows).toJson();
}
