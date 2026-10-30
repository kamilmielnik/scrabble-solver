import { afterAll, beforeEach, describe, expect, it, mock } from 'bun:test';

import { noop } from '../lib/noop';

const listeners: Record<string, (event: { waitUntil: (promise: unknown) => void }) => void> = {};
const calls: string[] = [];
const manifest = [{ revision: '1', url: '/a.js' }];
const selfDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'self');
const shellPromise = Promise.resolve();

Object.defineProperty(globalThis, 'self', {
  configurable: true,
  value: {
    __WB_MANIFEST: manifest,
    addEventListener: (type: string, listener: (typeof listeners)[string]) => {
      listeners[type] = listener;
    },
    clients: {
      claim: () => {
        calls.push('claim');
        return Promise.resolve();
      },
    },
    skipWaiting: () => {
      calls.push('skipWaiting');
      return Promise.resolve();
    },
  },
});

afterAll(() => {
  Object.defineProperty(globalThis, 'self', selfDescriptor!);
});

await mock.module('workbox-precaching', () => ({
  cleanupOutdatedCaches: () => calls.push('cleanupOutdatedCaches'),
  precacheAndRoute: (entries: unknown) => {
    expect(entries).toBe(manifest);
    calls.push('precacheAndRoute');
  },
}));
await mock.module('./appShell', () => ({
  cacheAppShell: () => {
    calls.push('cacheAppShell');
    return shellPromise;
  },
  routeNavigations: () => calls.push('routeNavigations'),
}));

await import('./index');

const bootCalls = [...calls];

describe('service worker', () => {
  beforeEach(() => {
    calls.length = 0;
  });

  it('precaches the manifest, then routes navigations, on boot', () => {
    expect(bootCalls).toEqual(['cleanupOutdatedCaches', 'precacheAndRoute', 'routeNavigations']);
  });

  it('holds the install open until the app shell is cached and takes over at once', () => {
    let waitedFor: unknown;

    listeners.install({
      waitUntil: (promise) => {
        waitedFor = promise;
      },
    });

    expect(waitedFor).toBe(shellPromise);
    expect(calls).toEqual(['cacheAppShell', 'skipWaiting']);
  });

  it('claims open pages on activation', () => {
    listeners.activate({ waitUntil: noop });

    expect(calls).toEqual(['claim']);
  });
});
