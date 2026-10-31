import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test';

import { advanceTimers, flushMicrotasks } from '../test/async';

import { waitForFirstIntent, waitForIdle, waitForIdleOrFirstIntent } from './waitForIdleOrFirstIntent';

let idleCallbacks: { callback: () => void; options: unknown }[];

beforeEach(() => {
  jest.useFakeTimers();
  idleCallbacks = [];
  Object.assign(window, {
    requestIdleCallback: (callback: () => void, options: unknown) => {
      idleCallbacks.push({ callback, options });
    },
  });
  setReadyState('complete');
});

afterEach(() => {
  jest.useRealTimers();
  Reflect.deleteProperty(window, 'requestIdleCallback');
  Reflect.deleteProperty(document, 'readyState');
});

describe('waitForIdle', () => {
  it('resolves on the idle callback, with a 5 s timeout', async () => {
    const settled = track(waitForIdle());

    await flushMicrotasks();
    expect(settled()).toBe(false);
    expect(idleCallbacks[0].options).toEqual({ timeout: 5000 });

    idleCallbacks[0].callback();
    await flushMicrotasks();
    expect(settled()).toBe(true);
  });

  it('waits for load when the document is still loading', async () => {
    setReadyState('loading');
    const settled = track(waitForIdle());

    expect(idleCallbacks).toHaveLength(0);

    window.dispatchEvent(new Event('load'));
    idleCallbacks[0].callback();
    await flushMicrotasks();

    expect(settled()).toBe(true);
  });

  it('falls back to a 5 s timer without requestIdleCallback', async () => {
    Reflect.deleteProperty(window, 'requestIdleCallback');
    const settled = track(waitForIdle());

    await advanceTimers(4999);
    expect(settled()).toBe(false);

    await advanceTimers(1);
    expect(settled()).toBe(true);
  });
});

describe('waitForFirstIntent', () => {
  it.each(['pointerdown', 'keydown'])('resolves on %s', async (type) => {
    const settled = track(waitForFirstIntent());

    await flushMicrotasks();
    expect(settled()).toBe(false);

    window.dispatchEvent(new Event(type));
    await flushMicrotasks();
    expect(settled()).toBe(true);
  });

  it('ignores idleness', async () => {
    const settled = track(waitForFirstIntent());

    await advanceTimers(10000);

    expect(settled()).toBe(false);
    expect(idleCallbacks).toHaveLength(0);
  });
});

describe('waitForIdleOrFirstIntent', () => {
  it('resolves when idle comes first', async () => {
    const settled = track(waitForIdleOrFirstIntent());

    idleCallbacks[0].callback();
    await flushMicrotasks();

    expect(settled()).toBe(true);
  });

  it('resolves when intent comes first', async () => {
    const settled = track(waitForIdleOrFirstIntent());

    window.dispatchEvent(new Event('pointerdown'));
    await flushMicrotasks();

    expect(settled()).toBe(true);
  });

  it('removes both listeners once settled, so a later key press does not settle it again', async () => {
    const remove = jest.spyOn(window, 'removeEventListener');

    track(waitForIdleOrFirstIntent());
    idleCallbacks[0].callback();
    await flushMicrotasks();

    expect(remove.mock.calls.map(([type]) => type)).toEqual(['pointerdown', 'keydown']);
    remove.mockRestore();
  });
});

function track(promise: Promise<void>): () => boolean {
  let isSettled = false;

  promise.then(
    () => {
      isSettled = true;
    },
    (error: unknown) => {
      throw error;
    },
  );

  return () => isSettled;
}

function setReadyState(value: DocumentReadyState): void {
  Object.defineProperty(document, 'readyState', { configurable: true, value });
}
