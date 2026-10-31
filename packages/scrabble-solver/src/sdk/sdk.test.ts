/* eslint-disable max-lines */

/* eslint-disable @typescript-eslint/await-thenable */

import { Board, Game, Locale, WordDefinition } from '@scrabble-solver/types';
import { type Mock, afterAll, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';

import { createResult, createVerifiedWord } from '../test/fixtures';

import type * as fetchModule from './fetch';
import type * as fetchJsonModule from './fetchJson';
import type * as findWordDefinitionsModule from './findWordDefinitions';
import type * as solveModule from './solve';
import type * as verifyModule from './verify';
import type * as visitModule from './visit';

type FetchFunction = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

const solveLocally = mock((_payload: unknown): Promise<unknown> => Promise.resolve(undefined));
const verifyLocally = mock((_payload: unknown): Promise<unknown> => Promise.resolve(undefined));

await mock.module('@/solver-worker', () => ({ solveLocally, verifyLocally }));

const { fetch }: typeof fetchModule = await import('./fetch');
const { fetchJson }: typeof fetchJsonModule = await import('./fetchJson');
const { findWordDefinitions }: typeof findWordDefinitionsModule = await import('./findWordDefinitions');
const { solve }: typeof solveModule = await import('./solve');
const { verify }: typeof verifyModule = await import('./verify');
const { visit }: typeof visitModule = await import('./visit');

const fetchMock = spyOn(window, 'fetch') as unknown as Mock<FetchFunction>;
const board = Board.create(15, 15).toJson();

beforeEach(() => {
  fetchMock.mockReset();
  solveLocally.mockReset();
  verifyLocally.mockReset();
  solveLocally.mockImplementation(() => Promise.resolve(undefined));
  verifyLocally.mockImplementation(() => Promise.resolve(undefined));
});

afterAll(() => {
  fetchMock.mockRestore();
});

describe('fetch', () => {
  it('returns an ok response', async () => {
    const response = new Response('ok');
    fetchMock.mockImplementation(() => Promise.resolve(response));

    expect(await fetch('/url')).toBe(response);
  });

  it('passes input and options through', async () => {
    const init = { method: 'POST' };
    fetchMock.mockImplementation(() => Promise.resolve(new Response('ok')));

    await fetch('/url', init);

    expect(fetchMock).toHaveBeenCalledWith('/url', init);
  });

  it('wraps a network failure', async () => {
    fetchMock.mockImplementation(() => Promise.reject(new TypeError('Failed to fetch')));

    await expect(fetch('/url')).rejects.toThrow('Network error: Failed to fetch');
  });

  it('wraps a failure that is not an error', async () => {
    fetchMock.mockImplementation(() => Promise.reject('text'));

    await expect(fetch('/url')).rejects.toThrow('Network error: Unknown error');
  });

  it('surfaces the server error message', async () => {
    fetchMock.mockImplementation(() => {
      return Promise.resolve(new Response(JSON.stringify({ message: 'Invalid "board"' }), { status: 400 }));
    });

    await expect(fetch('/url')).rejects.toThrow('Invalid "board"');
  });

  it('reports status for a JSON error body without a message', async () => {
    fetchMock.mockImplementation(() => {
      return Promise.resolve(new Response('{}', { status: 500, statusText: 'Server Error' }));
    });

    await expect(fetch('/url')).rejects.toThrow('HTTP 500: Server Error');
  });

  it('reports status for a non-JSON error body, such as an HTML 502 from a proxy', async () => {
    fetchMock.mockImplementation(() => {
      return Promise.resolve(new Response('<html>Bad Gateway</html>', { status: 502, statusText: 'Bad Gateway' }));
    });

    await expect(fetch('/url')).rejects.toThrow('HTTP 502: Bad Gateway');
  });
});

describe('fetchJson', () => {
  it('sends a JSON content type, keeping other headers', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(Response.json({ a: 1 })));

    const json = await fetchJson('/url', { headers: { 'X-Test': 'yes' }, method: 'PUT' });
    const init = fetchMock.mock.calls[0][1]!;
    const headers = new Headers(init.headers);

    expect(json).toEqual({ a: 1 });
    expect(init.method).toBe('PUT');
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('X-Test')).toBe('yes');
  });
});

describe('solve', () => {
  const payload = { board, characters: ['c', 'a', 't'], game: Game.Scrabble, locale: Locale.EN_US };
  const json = [createResult().toJson()];

  it('decodes worker results without touching the network', async () => {
    solveLocally.mockImplementation(() => Promise.resolve(json));

    const results = await solve(payload);

    expect(solveLocally).toHaveBeenCalledWith(payload);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(results[0].word).toBe('cat');
  });

  it('falls back to the API when the worker cannot answer', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(Response.json(json)));

    const results = await solve(payload);
    const [url, init] = fetchMock.mock.calls[0];

    expect(url).toBe('/api/solve');
    expect(init?.method).toBe('POST');
    expect(JSON.parse(init?.body as string)).toEqual(payload);
    expect(results[0].points).toBe(json[0].points);
  });

  it('keeps an empty worker answer instead of asking the server', async () => {
    solveLocally.mockImplementation(() => Promise.resolve([]));

    expect(await solve(payload)).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends only known fields', async () => {
    solveLocally.mockImplementation(() => Promise.resolve([]));

    await solve({ ...payload, extra: true } as never);

    expect(solveLocally).toHaveBeenCalledWith(payload);
  });
});

describe('verify', () => {
  const payload = { board, game: Game.Scrabble, locale: Locale.EN_US };
  const answer = { invalidWords: [], validWords: [createVerifiedWord()] };

  it('returns the worker answer without touching the network', async () => {
    verifyLocally.mockImplementation(() => Promise.resolve(answer));

    expect(await verify(payload)).toBe(answer as never);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('falls back to the API when the worker cannot answer', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(Response.json(answer)));

    expect(await verify(payload)).toEqual(answer);
    expect(fetchMock.mock.calls[0][0]).toBe('/api/verify');
    expect(fetchMock.mock.calls[0][1]?.method).toBe('POST');
  });
});

describe('visit', () => {
  it('pings the visit route', async () => {
    const payload = { game: Game.Scrabble, locale: Locale.EN_US, referrer: '', url: 'u' };
    fetchMock.mockImplementation(() => Promise.resolve(Response.json(true)));

    expect(await visit(payload)).toBe(true);
    expect(fetchMock.mock.calls[0][0]).toBe('/api/visit');
    expect(fetchMock.mock.calls[0][1]?.method).toBe('PUT');
    expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toEqual(payload);
  });
});

describe('findWordDefinitions', () => {
  it('decodes definitions and encodes the word in the URL', async () => {
    const json = { definitions: ['a'], exists: true, isAllowed: true, word: 'żółw, cat' };
    fetchMock.mockImplementation(() => Promise.resolve(Response.json([json])));

    const [definition] = await findWordDefinitions(Locale.PL_PL, 'żółw, cat');

    expect(fetchMock.mock.calls[0][0]).toBe(`/api/dictionary/pl-PL/${encodeURIComponent('żółw, cat')}`);
    expect(definition).toBeInstanceOf(WordDefinition);
    expect(definition.definitions).toEqual(['a']);
  });

  it('decodes a null entry into the null definition', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(Response.json([null])));

    expect(await findWordDefinitions(Locale.PL_PL, 'x')).toEqual([WordDefinition.Null]);
  });
});
