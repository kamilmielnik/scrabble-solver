import { afterAll, beforeEach, describe, expect, it } from 'bun:test';

import { cacheAppShell, respondToNavigation } from './appShell';

const entries = new Map<string, Response>();

let respond: () => Promise<Response> = () => Promise.resolve(html('shell'));

const globals = { caches: globalThis.caches, fetch: globalThis.fetch };

Object.assign(globalThis, {
  caches: createCacheStorage(entries),
  fetch: () => respond(),
});

afterAll(() => {
  Object.assign(globalThis, globals);
});

describe('respondToNavigation', () => {
  beforeEach(() => {
    entries.clear();
    respond = () => Promise.resolve(html('shell'));
  });

  it('serves the network response while online', async () => {
    await cacheAppShell();
    respond = () => Promise.resolve(html('deployed shell'));
    const response = await respondToNavigation({ request: navigation('/') });
    expect(await response.text()).toEqual('deployed shell');
  });

  it('serves the shell cached on install when the network is gone', async () => {
    await cacheAppShell();
    respond = () => Promise.reject(new Error('offline'));
    const response = await respondToNavigation({ request: navigation('/') });
    expect(await response.text()).toEqual('shell');
  });

  it('serves the shell for any navigated path', async () => {
    await cacheAppShell();
    respond = () => Promise.reject(new Error('offline'));
    const response = await respondToNavigation({ request: navigation('/not-found') });
    expect(await response.text()).toEqual('shell');
  });

  /**
   * The cached shell links to the chunks precached next to it, so a navigation
   * must not replace it with HTML from a build this worker did not precache.
   */
  it('keeps the installed shell when a newer one is served from the network', async () => {
    await cacheAppShell();
    respond = () => Promise.resolve(html('deployed shell'));
    await respondToNavigation({ request: navigation('/') });

    respond = () => Promise.reject(new Error('offline'));
    const response = await respondToNavigation({ request: navigation('/') });
    expect(await response.text()).toEqual('shell');
  });

  it('rethrows when there is nothing to fall back on', async () => {
    respond = () => Promise.reject(new Error('offline'));
    const error = await respondToNavigation({ request: navigation('/') }).catch((reason: Error) => reason);
    expect(error).toEqual(new Error('offline'));
  });
});

function navigation(url: string): Request {
  return new Request(new URL(url, 'https://scrabble-solver.com'));
}

function html(body: string): Response {
  return new Response(body, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

function createCacheStorage(cacheEntries: Map<string, Response>): CacheStorage {
  return {
    open: (name: string) =>
      Promise.resolve({
        add: async (url: string) => {
          cacheEntries.set(`${name} ${url}`, await globalThis.fetch(url));
        },
        match: (url: string) => Promise.resolve(cacheEntries.get(`${name} ${url}`)?.clone()),
      }),
  } as unknown as CacheStorage;
}
