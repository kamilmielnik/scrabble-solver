/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Gaddag } from '@kamilmielnik/gaddag';
import { BLANK } from '@scrabble-solver/constants';
import { type ResultJson, Board, Game, Locale } from '@scrabble-solver/types';
import { beforeEach, describe, expect, it, mock } from 'bun:test';

import type * as apiSolveModule from '../../pages/api/solve';
import type * as testApiModule from '../../test/api';

const gaddag = Gaddag.fromArray(['at', 'cat', 'tar']);
const logEvent = mock<(event: Record<string, unknown>) => void>();
const logError = mock<(operation: string, error: unknown, context: Record<string, unknown>) => void>();
const get = mock((_locale: Locale): Promise<Gaddag> => Promise.resolve(gaddag));

await mock.module('@scrabble-solver/logger', () => ({ logError, logEvent }));
await mock.module('@scrabble-solver/dictionaries', () => ({ dictionaries: { get } }));

const { config, default: handler }: typeof apiSolveModule = await import('../../pages/api/solve');
const { createApiRequest, createApiResponse }: typeof testApiModule = await import('../../test/api');

const board = Board.create(15, 15).toJson();
const validBody = { board, characters: ['c', 'a', 't'], game: Game.Scrabble, locale: Locale.EN_US };

beforeEach(() => {
  logEvent.mockClear();
  logError.mockClear();
  get.mockClear();
  get.mockImplementation(() => Promise.resolve(gaddag));
});

describe('/api/solve', () => {
  it('finds words from the rack with the dictionary of the requested locale', async () => {
    const response = await solve(validBody);
    const words = (response.body as ResultJson[]).map((result) => result.tiles.join(''));

    expect(response.statusCode).toBe(200);
    expect(words).toContain('cat');
    expect(words).toContain('at');
    expect(get).toHaveBeenCalledWith(Locale.EN_US);
  });

  it('treats a blank character as a blank tile', async () => {
    const response = await solve({ ...validBody, characters: [BLANK, 'a', 't'] });
    const results = response.body as ResultJson[];

    expect(results.some((result) => result.blankIndices.length === 1)).toBe(true);
  });

  it('logs the outcome after answering', async () => {
    const response = await solve({ ...validBody, board: Board.create(15, 15).toJson() });

    expect(logEvent).toHaveBeenCalledTimes(1);
    expect(logEvent.mock.calls[0][0]).toMatchObject({
      blanks: 0,
      game: Game.Scrabble,
      ip: '10.0.0.1',
      locale: Locale.EN_US,
      rack: 'c,a,t',
      results: (response.body as ResultJson[]).length,
      tiles: 0,
      type: 'solve',
    });
  });

  it.each([
    ['locale', { locale: 'xx-XX' }, 'Invalid "locale" parameter'],
    ['game', { game: 'chess' }, 'Invalid "game" parameter'],
    ['missing characters', { characters: undefined }, 'Invalid "characters" parameter'],
    ['non-string characters', { characters: ['a', 1] }, 'Invalid "characters" parameter'],
    ['empty characters', { characters: [] }, 'Invalid "characters" parameter'],
    ['a game outside the locale', { game: Game.Kelimelik }, 'No game "kelimelik" in "en-US"'],
    ['an empty character', { characters: [''] }, 'Invalid "characters" parameter'],
    ['a long character', { characters: ['abc'] }, 'Invalid "characters" parameter'],
    ['too many blanks', { characters: [BLANK, BLANK, BLANK] }, 'Too many blank tiles passed'],
    ['a malformed board', { board: 'nope' }, 'Invalid "board" parameter'],
    ['a badly sized board', { board: board.slice(1) }, 'Invalid "board" parameter'],
  ])('rejects %s with 400', async (_name, overrides, message) => {
    const response = await solve({ ...validBody, ...overrides });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: 'Bad request', message });
    expect(get).not.toHaveBeenCalled();
  });

  it('accepts as many blanks as the game has', async () => {
    const response = await solve({ ...validBody, characters: [BLANK, BLANK] });

    expect(response.statusCode).toBe(200);
  });

  it('answers 500 when the dictionary is unavailable', async () => {
    get.mockImplementation(() => Promise.reject(new Error('no dictionary')));

    const response = await solve(validBody);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Server error', message: 'no dictionary' });
    expect(logError).toHaveBeenCalledTimes(1);
  });

  it('allows large responses', () => {
    expect(config.api.responseLimit).toBe('25mb');
  });
});

async function solve(body: unknown) {
  const response = createApiResponse();
  await handler(createApiRequest({ body }), response);
  return response;
}
