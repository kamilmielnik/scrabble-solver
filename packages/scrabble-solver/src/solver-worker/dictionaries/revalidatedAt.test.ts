import { Locale } from '@scrabble-solver/types';
import { afterAll, beforeEach, describe, expect, it } from 'bun:test';

import { REVALIDATED_AT_CACHE } from './constants';
import { getDictionaryUrl } from './getDictionaryUrl';
import { clearRevalidatedAt, readRevalidatedAt, writeRevalidatedAt } from './revalidatedAt';

const entries = new Map<string, string>();
const opened: string[] = [];
const globals = { caches: globalThis.caches };

Object.assign(globalThis, {
  caches: {
    open: (name: string) => {
      opened.push(name);

      return Promise.resolve({
        delete: (url: string) => Promise.resolve(entries.delete(url)),
        match: (url: string) => {
          const body = entries.get(url);
          return Promise.resolve(typeof body === 'undefined' ? undefined : new Response(body));
        },
        put: async (url: string, response: Response) => {
          entries.set(url, await response.text());
        },
      });
    },
  },
});

afterAll(() => {
  Object.assign(globalThis, globals);
});

beforeEach(() => {
  entries.clear();
  opened.length = 0;
});

describe('getDictionaryUrl', () => {
  it('points at the dictionary route of a locale', () => {
    expect(getDictionaryUrl(Locale.PL_PL)).toBe('/api/dictionary/pl-PL');
  });
});

describe('revalidatedAt', () => {
  it('reads 0 when no revalidation is known', async () => {
    expect(await readRevalidatedAt(Locale.DE_DE)).toBe(0);
  });

  it('reads a timestamp another worker persisted', async () => {
    entries.set(getDictionaryUrl(Locale.ES_ES), '1234');

    expect(await readRevalidatedAt(Locale.ES_ES)).toBe(1234);
    expect(opened).toContain(REVALIDATED_AT_CACHE);
  });

  it('treats an unreadable persisted timestamp as never', async () => {
    entries.set(getDictionaryUrl(Locale.FA_IR), 'not a number');

    expect(await readRevalidatedAt(Locale.FA_IR)).toBe(0);
  });

  it('reads the cache at most once per locale', async () => {
    entries.set(getDictionaryUrl(Locale.FR_FR), '1');
    await readRevalidatedAt(Locale.FR_FR);
    entries.set(getDictionaryUrl(Locale.FR_FR), '2');

    expect(await readRevalidatedAt(Locale.FR_FR)).toBe(1);
  });

  it('persists a written timestamp and serves it from memory', async () => {
    await writeRevalidatedAt(Locale.PL_PL, 500);

    expect(entries.get(getDictionaryUrl(Locale.PL_PL))).toBe('500');
    entries.clear();
    expect(await readRevalidatedAt(Locale.PL_PL)).toBe(500);
  });

  it('forgets a cleared timestamp in memory and in the cache', async () => {
    await writeRevalidatedAt(Locale.RO_RO, 500);
    await clearRevalidatedAt(Locale.RO_RO);

    expect(entries.has(getDictionaryUrl(Locale.RO_RO))).toBe(false);
    expect(await readRevalidatedAt(Locale.RO_RO)).toBe(0);
  });

  it('lets a reset that lands during a read win over the value being read', async () => {
    entries.set(getDictionaryUrl(Locale.TR_TR), '999');

    const read = readRevalidatedAt(Locale.TR_TR);
    await clearRevalidatedAt(Locale.TR_TR);

    expect(await read).toBe(0);
  });
});
