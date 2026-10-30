/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Gaddag } from '@kamilmielnik/gaddag';
import { games } from '@scrabble-solver/configs';
import { Locale, WordDefinition } from '@scrabble-solver/types';
import { beforeEach, describe, expect, it, mock } from 'bun:test';

import { noop } from '../../lib/noop';
import type * as localeWordModule from '../../pages/api/dictionary/[locale]/[word]';
import type * as testApiModule from '../../test/api';

const logEvent = mock<(event: Record<string, unknown>) => void>();
const get = mock((_locale: Locale): Promise<Gaddag> => Promise.resolve(Gaddag.fromArray(['cat', 'dog'])));
const getWordDefinition = mock((_locale: Locale, word: string, isAllowed: boolean) => {
  return Promise.resolve(
    new WordDefinition({ definitions: isAllowed ? [`${word} definition`] : [], exists: true, isAllowed, word }),
  );
});

await mock.module('@scrabble-solver/logger', () => ({ logError: noop, logEvent }));
await mock.module('@scrabble-solver/dictionaries', () => ({ dictionaries: { get } }));
await mock.module('@scrabble-solver/word-definitions', () => ({ getWordDefinition }));

const { default: handler }: typeof localeWordModule = await import('../../pages/api/dictionary/[locale]/[word]');
const { createApiRequest, createApiResponse }: typeof testApiModule = await import('../../test/api');

beforeEach(() => {
  logEvent.mockClear();
  getWordDefinition.mockClear();
});

describe('/api/dictionary/[locale]/[word]', () => {
  it('looks up a word and tells the source whether the game allows it', async () => {
    const response = await define('cat');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ definitions: ['cat definition'], exists: true, isAllowed: true, word: 'cat' }]);
    expect(getWordDefinition).toHaveBeenCalledWith(Locale.EN_US, 'cat', true);
  });

  it('marks a word outside the dictionary', async () => {
    await define('zzz');

    expect(getWordDefinition).toHaveBeenCalledWith(Locale.EN_US, 'zzz', false);
  });

  it('splits, trims and de-duplicates a comma separated list', async () => {
    await define(' cat, dog ,cat,,');

    expect(getWordDefinition.mock.calls.map(([, word]) => word)).toEqual(['cat', 'dog']);
  });

  it('splits on the Arabic comma too', async () => {
    await define('cat،dog');

    expect(getWordDefinition.mock.calls.map(([, word]) => word)).toEqual(['cat', 'dog']);
  });

  it('logs words and how many have definitions', async () => {
    await define('cat,zzz');

    expect(logEvent.mock.calls[0][0]).toMatchObject({
      found: 1,
      ip: '10.0.0.1',
      locale: Locale.EN_US,
      type: 'definition',
      words: 'cat,zzz',
    });
  });

  it('answers an empty list when the input holds only separators', async () => {
    const response = await define(',');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  it.each([
    ['a missing word', { locale: Locale.EN_US }, 'Invalid "word" parameter'],
    ['an empty word', { locale: Locale.EN_US, word: '' }, 'Invalid "word" parameter'],
    ['a repeated word parameter', { locale: Locale.EN_US, word: ['a', 'b'] }, 'Invalid "word" parameter'],
    ['an unknown locale', { locale: 'xx', word: 'cat' }, 'Invalid "locale" parameter'],
  ])('rejects %s with 400', async (_name, query, message) => {
    const response = await request(query);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: 'Bad request', message });
  });

  it('caps the list at the biggest rack plus the word itself', async () => {
    const limit = Math.max(...Object.values(games).map(({ rackSize }) => rackSize)) + 1;

    expect((await define(createWords(limit))).statusCode).toBe(200);
    expect((await define(createWords(limit + 1))).statusCode).toBe(400);
  });
});

function createWords(count: number): string {
  return Array.from({ length: count }, (_, index) => `w${index}`).join(',');
}

function define(word: string) {
  return request({ locale: Locale.EN_US, word });
}

async function request(query: Record<string, string[] | string>) {
  const response = createApiResponse();
  await handler(createApiRequest({ method: 'GET', query }), response);
  return response;
}
