import { beforeEach, describe, expect, it, mock } from 'bun:test';

import type * as preloadModule from './preload';

const waitForIdleOrFirstIntent = mock(() => Promise.resolve());

await mock.module('@/lib/waitForIdleOrFirstIntent', () => ({
  waitForFirstIntent: () => Promise.resolve(),
  waitForIdle: () => Promise.resolve(),
  waitForIdleOrFirstIntent,
}));

let moduleId = 0;

beforeEach(() => {
  waitForIdleOrFirstIntent.mockClear();
});

describe('schedulePreloadModals', () => {
  it('does nothing during SSR', async () => {
    const { schedulePreloadModals } = await importFreshModule();
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'window')!;
    Object.defineProperty(globalThis, 'window', { configurable: true, value: undefined });

    schedulePreloadModals();

    Object.defineProperty(globalThis, 'window', descriptor);

    expect(waitForIdleOrFirstIntent).not.toHaveBeenCalled();
  });

  it('schedules once, however many times it is called', async () => {
    const { schedulePreloadModals } = await importFreshModule();

    schedulePreloadModals();
    schedulePreloadModals();

    expect(waitForIdleOrFirstIntent).toHaveBeenCalledTimes(1);
    await waitForIdleOrFirstIntent.mock.results[0].value;
    await Promise.all([import('./MenuModal'), import('./WordsModal')]);
  });
});

function importFreshModule(): Promise<typeof preloadModule> {
  return import(`./preload.ts?fresh=${++moduleId}`) as Promise<typeof preloadModule>;
}
