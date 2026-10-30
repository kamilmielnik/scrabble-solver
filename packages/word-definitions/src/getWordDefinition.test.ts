import { Locale, WordDefinition } from '@scrabble-solver/types';
import { beforeEach, describe, expect, it, mock } from 'bun:test';

import type * as getWordDefinitionModule from './getWordDefinition';
import { normalizeDefinition } from './lib/normalizeDefinition';
import { unique } from './lib/unique';

const request = mock<(options: { hostname: string; path: string }) => Promise<string>>();

await mock.module('./lib', () => ({ normalizeDefinition, request, unique }));

const { getWordDefinition }: typeof getWordDefinitionModule = await import('./getWordDefinition');

const ENGLISH_ENTRY = JSON.stringify({ en: [{ definitions: [{ definition: 'a <b>domestic</b> animal:' }] }] });
const ENGLISH_NOT_FOUND = JSON.stringify({ status: 404, type: 'Internal error' });

beforeEach(() => {
  request.mockReset();
});

describe('getWordDefinition', () => {
  it('crawls the word for the locale and parses the response into a WordDefinition', async () => {
    request.mockResolvedValue(ENGLISH_ENTRY);

    const wordDefinition = await getWordDefinition(Locale.EN_US, 'cat', true);

    expect(request.mock.calls[0][0].path).toBe('/api/rest_v1/page/definition/cat');
    expect(wordDefinition).toBeInstanceOf(WordDefinition);
    expect(wordDefinition.toJson()).toEqual({
      definitions: ['a domestic animal'],
      exists: true,
      isAllowed: true,
      word: 'cat',
    });
  });

  it('uses the parser of the requested locale', async () => {
    request.mockResolvedValue(
      '<div id="vitemselected"><span>CHAT</span></div><div class="tlf_cdefinition">Petit félin.</div>',
    );

    const wordDefinition = await getWordDefinition(Locale.FR_FR, 'chat', true);

    expect(request.mock.calls[0][0].hostname).toBe('www.cnrtl.fr');
    expect(wordDefinition.definitions).toEqual(['Petit félin.']);
    expect(wordDefinition.exists).toBe(true);
  });

  it('keeps the word as given, not as encoded for the URL', async () => {
    request.mockResolvedValue(ENGLISH_ENTRY);

    const wordDefinition = await getWordDefinition(Locale.EN_GB, 'naïve', true);

    expect(wordDefinition.word).toBe('naïve');
  });

  it.each([true, false])('passes isAllowed=%p through for a word with an entry', async (isAllowed) => {
    request.mockResolvedValue(ENGLISH_ENTRY);

    const wordDefinition = await getWordDefinition(Locale.EN_US, 'cat', isAllowed);

    expect(wordDefinition.isAllowed).toBe(isAllowed);
    expect(wordDefinition.exists).toBe(true);
  });

  it.each([true, false])('passes isAllowed=%p through for a word without an entry', async (isAllowed) => {
    request.mockResolvedValue(ENGLISH_NOT_FOUND);

    const wordDefinition = await getWordDefinition(Locale.EN_US, 'zzzzqq', isAllowed);

    expect(wordDefinition.toJson()).toEqual({ definitions: [], exists: false, isAllowed, word: 'zzzzqq' });
  });

  it('rejects with the error of the request', async () => {
    const error = new Error('connect ETIMEDOUT');
    request.mockRejectedValue(error);

    expect(await getWordDefinition(Locale.EN_US, 'cat', true).catch(returnError)).toBe(error);
  });
});

function returnError(error: unknown): unknown {
  return error;
}
