/* eslint-disable @typescript-eslint/await-thenable */

import { flushMicrotasks } from '../test/async';

import { memoize } from './memoize';
import { noop } from './noop';

describe('memoize', () => {
  it('computes once per parameter list', () => {
    let calls = 0;
    const double = memoize((value: number) => {
      ++calls;
      return value * 2;
    });

    expect([double(2), double(2), double(3)]).toEqual([4, 4, 6]);
    expect(calls).toBe(2);
  });

  it('compares every parameter by identity', () => {
    let calls = 0;
    const join = memoize((a: string, b: string) => {
      ++calls;
      return a + b;
    });

    join('a', 'b');
    join('a', 'c');
    join('b', 'b');

    expect(calls).toBe(3);
  });

  it('treats a different parameter count as a different call', () => {
    let calls = 0;
    const count = memoize((...values: number[]) => {
      ++calls;
      return values.length + 1;
    });

    count(1);
    count(1, 2);

    expect(calls).toBe(2);
  });

  it('reports what is cached', () => {
    const identity = memoize((value: string) => value);

    expect(identity.hasCache('a')).toBe(false);
    identity('a');
    expect(identity.hasCache('a')).toBe(true);
    expect(identity.hasCache('b')).toBe(false);
  });

  it('shares a pending promise between callers', () => {
    let calls = 0;
    const load = memoize((_key: string) => {
      ++calls;
      return new Promise(noop);
    });

    expect(load('a')).toBe(load('a'));
    expect(calls).toBe(1);
  });

  it('forgets a rejected promise so the next call retries', async () => {
    let calls = 0;
    const load = memoize((_key: string) => {
      ++calls;
      return calls === 1 ? Promise.reject(new Error('down')) : Promise.resolve('ok');
    });

    await expect(load('a')).rejects.toThrow('down');
    await flushMicrotasks();

    expect(load.hasCache('a')).toBe(false);
    expect(await load('a')).toBe('ok');
  });

  it('forgets only the rejected entry', async () => {
    const load = memoize((key: string) => (key === 'bad' ? Promise.reject(new Error('down')) : Promise.resolve(key)));

    await load('good');
    await load('bad').catch(() => undefined);
    await flushMicrotasks();

    expect(load.hasCache('good')).toBe(true);
    expect(load.hasCache('bad')).toBe(false);
  });
});
