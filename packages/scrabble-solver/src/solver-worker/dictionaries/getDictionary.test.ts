import { Locale } from '@scrabble-solver/types';
import { afterAll, beforeEach, describe, expect, it, mock } from 'bun:test';

import { DICTIONARY_CACHE, REVALIDATED_AT_CACHE } from './constants';
import type * as getDictionaryModule from './getDictionary';

const events: string[] = [];
const dictionary = new Response('bytes');
const globals = { caches: globalThis.caches };

Object.assign(globalThis, {
  caches: {
    open: (name: string) => {
      return Promise.resolve({
        delete: (url: string) => {
          events.push(`delete ${name} ${url}`);
          return Promise.resolve(true);
        },
        match: (url: string) => {
          events.push(`match ${name} ${url}`);
          return Promise.resolve(url.endsWith(Locale.PL_PL) ? dictionary : undefined);
        },
      });
    },
  },
});

afterAll(() => {
  Object.assign(globalThis, globals);
});

await mock.module('./revalidateDictionary', () => ({
  resetRevalidationThrottle: (locale: Locale) => {
    events.push(`reset ${locale}`);
    return Promise.resolve();
  },
}));

const { deleteDictionary, getDictionary }: typeof getDictionaryModule = await import('./getDictionary');

beforeEach(() => {
  events.length = 0;
});

describe('getDictionary', () => {
  it('reads the cached response of a locale', async () => {
    expect(await getDictionary(Locale.PL_PL)).toBe(dictionary);
    expect(events).toEqual([`match ${DICTIONARY_CACHE} /api/dictionary/pl-PL`]);
  });

  it('is undefined when the locale is not cached', async () => {
    expect(await getDictionary(Locale.DE_DE)).toBeUndefined();
  });
});

describe('deleteDictionary', () => {
  it('deletes the entry before resetting the throttle, so nothing can re-arm it for the doomed entry', async () => {
    await deleteDictionary(Locale.DE_DE);

    expect(events).toEqual([`delete ${DICTIONARY_CACHE} /api/dictionary/de-DE`, 'reset de-DE']);
  });
});

describe('constants', () => {
  it('uses distinct caches', () => {
    expect(DICTIONARY_CACHE).not.toBe(REVALIDATED_AT_CACHE);
  });
});
