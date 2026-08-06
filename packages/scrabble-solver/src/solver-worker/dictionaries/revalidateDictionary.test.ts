import { Locale } from '@scrabble-solver/types';
import { afterAll, beforeEach, describe, expect, it, mock } from 'bun:test';

import { DICTIONARY_CACHE, REVALIDATED_AT_CACHE } from './constants';
import type * as getDictionaryModule from './getDictionary';
import { getDictionaryUrl } from './getDictionaryUrl';
import type * as revalidateDictionaryModule from './revalidateDictionary';

const HOUR = 60 * 60 * 1000;

const fetchCalls: { cache: RequestCache | undefined; ifNoneMatch: string | undefined; url: string }[] = [];
const updatedTimestamps: string[] = [];
let respond: () => Promise<Response> = () => Promise.resolve(notModified());

await mock.module('./expirationManager', () => ({
  expirationManager: {
    expireEntries: () => Promise.resolve(),
    updateTimestamp: (url: string) => {
      updatedTimestamps.push(url);
      return Promise.resolve();
    },
  },
}));

const globals = { caches: globalThis.caches, fetch: globalThis.fetch };

Object.assign(globalThis, {
  caches: createCacheStorage(),
  fetch: (url: string, { cache, headers }: RequestInit) => {
    fetchCalls.push({ cache, ifNoneMatch: (headers as Record<string, string>)['If-None-Match'], url });
    return respond();
  },
});

afterAll(() => {
  Object.assign(globalThis, globals);
});

const { resetRevalidationThrottle, revalidateDictionary }: typeof revalidateDictionaryModule =
  await import('./revalidateDictionary');
const { deleteDictionary }: typeof getDictionaryModule = await import('./getDictionary');

describe('revalidateDictionary', () => {
  beforeEach(() => {
    fetchCalls.length = 0;
    updatedTimestamps.length = 0;
    respond = () => Promise.resolve(notModified());
  });

  /**
   * `no-store` would look equivalent, but makes the browser send
   * `Cache-Control: no-cache`, which Next.js answers with the whole body.
   */
  it('sends a conditional request the HTTP cache cannot answer', async () => {
    const locale = await unthrottled(Locale.EN_US);
    await cacheDictionary(locale, 'dictionary', '"v1"');
    await revalidateDictionary(locale);
    expect(fetchCalls).toEqual([{ cache: 'no-cache', ifNoneMatch: '"v1"', url: '/api/dictionary/en-US' }]);
  });

  it('keeps the cached body on 304', async () => {
    const locale = await unthrottled(Locale.EN_GB);
    await cacheDictionary(locale, 'dictionary', '"v1"');
    await revalidateDictionary(locale);
    expect(await readCachedDictionary(locale)).toBe('dictionary');
    expect(updatedTimestamps).toEqual([getDictionaryUrl(locale)]);
  });

  it('replaces the cached body on 200', async () => {
    const locale = await unthrottled(Locale.DE_DE);
    await cacheDictionary(locale, 'old', '"v1"');
    respond = () => Promise.resolve(new Response('new', { headers: { etag: '"v2"' } }));
    await revalidateDictionary(locale);
    expect(await readCachedDictionary(locale)).toBe('new');
    expect(updatedTimestamps).toEqual([getDictionaryUrl(locale)]);
  });

  it('omits If-None-Match when nothing is cached', async () => {
    const locale = await unthrottled(Locale.ES_ES);
    respond = () => Promise.resolve(new Response('dictionary'));
    await revalidateDictionary(locale);
    expect(fetchCalls[0].ifNoneMatch).toBeUndefined();
    expect(await readCachedDictionary(locale)).toBe('dictionary');
  });

  it('rejects a failed response without arming the throttle', async () => {
    const locale = await unthrottled(Locale.FA_IR);
    respond = () => Promise.resolve(new Response(null, { status: 503, statusText: 'Service Unavailable' }));
    const failure = await revalidateDictionary(locale).catch((error: Error) => error.message);
    expect(failure).toBe('HTTP 503: Service Unavailable');
    respond = () => Promise.resolve(notModified());
    await revalidateDictionary(locale);
    expect(fetchCalls).toHaveLength(2);
  });

  it('revalidates at most once per interval', async () => {
    const locale = await unthrottled(Locale.FR_FR);
    await revalidateDictionary(locale);
    await revalidateDictionary(locale);
    expect(fetchCalls).toHaveLength(1);
  });

  it('shares one request between concurrent callers', async () => {
    const locale = await unthrottled(Locale.EN_US);
    await Promise.all([revalidateDictionary(locale), revalidateDictionary(locale), revalidateDictionary(locale)]);
    expect(fetchCalls).toHaveLength(1);
  });

  it('persists the throttle, so a later page load can honour it', async () => {
    const locale = await unthrottled(Locale.PL_PL);
    await revalidateDictionary(locale);
    expect(await readPersistedRevalidatedAt(locale)).toBeGreaterThan(Date.now() - HOUR);
  });

  /**
   * This locale and the next are used nowhere else: the worker is created per
   * page, so only a locale unseen in memory exercises a fresh page's read.
   */
  it('honours a throttle persisted by an earlier page load', async () => {
    await persistRevalidatedAt(Locale.RO_RO, Date.now() - 1000);
    await revalidateDictionary(Locale.RO_RO);
    expect(fetchCalls).toHaveLength(0);
  });

  it('revalidates when a throttle persisted by an earlier page load has expired', async () => {
    await persistRevalidatedAt(Locale.TR_TR, Date.now() - 2 * HOUR);
    await revalidateDictionary(Locale.TR_TR);
    expect(fetchCalls).toHaveLength(1);
  });

  it('lets the next access revalidate after the dictionary is deleted', async () => {
    const locale = await unthrottled(Locale.DE_DE);
    await revalidateDictionary(locale);
    await revalidateDictionary(locale);
    await deleteDictionary(locale);
    await revalidateDictionary(locale);
    expect(fetchCalls).toHaveLength(2);
  });

  it('does not arm the throttle when the dictionary is deleted mid-revalidation', async () => {
    const locale = await unthrottled(Locale.EN_GB);
    let release: (response: Response) => void = () => undefined;
    respond = () => new Promise((resolve) => (release = resolve));
    const revalidation = revalidateDictionary(locale);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await resetRevalidationThrottle(locale);
    release(notModified());
    await revalidation;
    respond = () => Promise.resolve(notModified());
    await revalidateDictionary(locale);
    expect(fetchCalls).toHaveLength(2);
  });
});

/** Throttle state outlives a test, so tests sharing a locale start it un-throttled. */
async function unthrottled(locale: Locale): Promise<Locale> {
  await resetRevalidationThrottle(locale);
  return locale;
}

async function cacheDictionary(locale: Locale, body: string, etag: string): Promise<void> {
  const cache = await caches.open(DICTIONARY_CACHE);
  await cache.put(getDictionaryUrl(locale), new Response(body, { headers: { etag } }));
}

async function readCachedDictionary(locale: Locale): Promise<string | undefined> {
  const cache = await caches.open(DICTIONARY_CACHE);
  return (await cache.match(getDictionaryUrl(locale)))?.text();
}

async function persistRevalidatedAt(locale: Locale, timestamp: number): Promise<void> {
  const cache = await caches.open(REVALIDATED_AT_CACHE);
  await cache.put(getDictionaryUrl(locale), new Response(String(timestamp)));
}

async function readPersistedRevalidatedAt(locale: Locale): Promise<number> {
  const cache = await caches.open(REVALIDATED_AT_CACHE);
  return Number(await (await cache.match(getDictionaryUrl(locale)))?.text());
}

function notModified(): Response {
  return new Response(null, { status: 304 });
}

function createCacheStorage(): CacheStorage {
  const entries = new Map<string, Response>();

  return {
    open: (name: string) =>
      Promise.resolve({
        delete: (url: string) => Promise.resolve(entries.delete(`${name} ${url}`)),
        match: (url: string) => Promise.resolve(entries.get(`${name} ${url}`)?.clone()),
        put: (url: string, response: Response) => {
          entries.set(`${name} ${url}`, response);
          return Promise.resolve();
        },
      }),
  } as unknown as CacheStorage;
}
