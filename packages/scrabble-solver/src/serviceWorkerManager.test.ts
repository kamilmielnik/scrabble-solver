import { afterAll, beforeEach, describe, expect, it, mock } from 'bun:test';

import type * as serviceWorkerManagerModule from './serviceWorkerManager';

const registered: string[] = [];
const events: string[] = [];

class FakeWorkbox {
  private readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  public register(): Promise<void> {
    events.push('register');
    registered.push(this.url);
    return Promise.resolve();
  }
}

await mock.module('workbox-window', () => ({ Workbox: FakeWorkbox }));
await mock.module('@/lib/waitForIdleOrFirstIntent', () => ({
  waitForIdle: () => {
    events.push('idle');
    return Promise.resolve();
  },
}));

const { registerServiceWorker }: typeof serviceWorkerManagerModule = await import('./serviceWorkerManager');

const navigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator')!;

afterAll(() => {
  Object.defineProperty(globalThis, 'navigator', navigatorDescriptor);
});

beforeEach(() => {
  registered.length = 0;
  events.length = 0;
});

describe('registerServiceWorker', () => {
  it('does nothing without a navigator (SSR)', async () => {
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: undefined });

    await registerServiceWorker();

    expect(events).toEqual([]);
  });

  it('does nothing when the browser has no service workers', async () => {
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {} });

    await registerServiceWorker();

    expect(events).toEqual([]);
  });

  it('registers only after the page is idle', async () => {
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { serviceWorker: {} } });

    await registerServiceWorker();

    expect(events).toEqual(['idle', 'register']);
    expect(registered).toEqual(['/service-worker.js']);
  });
});
