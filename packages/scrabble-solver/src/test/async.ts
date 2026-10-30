import { act } from '@testing-library/react';
import { jest } from 'bun:test';

const MICROTASK_ROUNDS = 25;

export async function flushMicrotasks(): Promise<void> {
  for (let round = 0; round < MICROTASK_ROUNDS; ++round) {
    await Promise.resolve();
  }
}

export async function advanceTimers(ms: number): Promise<void> {
  jest.advanceTimersByTime(ms);
  await flushMicrotasks();
}

export async function flushEffects(): Promise<void> {
  await act(async () => {
    await flushMicrotasks();
  });
}

export async function flushTimers(): Promise<void> {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

export function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return { promise, reject, resolve };
}
