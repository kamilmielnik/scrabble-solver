import { describe, expect, it, mock } from 'bun:test';

import { getRejection } from '../test/getRejection';

import { createAsyncProxy } from './createAsyncProxy';

describe('createAsyncProxy', () => {
  it('resolves with the value of the callback', async () => {
    const proxy = createAsyncProxy(() => Promise.resolve('value'));

    expect(await proxy()).toBe('value');
  });

  it('runs the callback once for concurrent calls and gives every caller its result', async () => {
    const { promise, resolve } = Promise.withResolvers<string>();
    const callback = mock(() => promise);
    const proxy = createAsyncProxy(callback);

    const calls = [proxy(), proxy(), proxy()];
    resolve('value');

    expect(await Promise.all(calls)).toEqual(['value', 'value', 'value']);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('runs the callback again for sequential calls', async () => {
    const callback = mock(() => Promise.resolve(callback.mock.calls.length));
    const proxy = createAsyncProxy(callback);

    expect(await proxy()).toBe(1);
    expect(await proxy()).toBe(2);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('rejects every concurrent caller when the callback rejects', async () => {
    const { promise, reject } = Promise.withResolvers<string>();
    const callback = mock(() => promise);
    const proxy = createAsyncProxy(callback);
    const error = new Error('failed');

    const calls = [proxy(), proxy()];
    reject(error);

    expect(await Promise.allSettled(calls)).toEqual([
      { reason: error, status: 'rejected' },
      { reason: error, status: 'rejected' },
    ]);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('runs the callback again after a rejection', async () => {
    const error = new Error('failed');
    const callback = mock(() => Promise.resolve('value'));
    callback.mockImplementationOnce(() => Promise.reject(error));
    const proxy = createAsyncProxy(callback);

    expect(await getRejection(proxy())).toBe(error);
    expect(await proxy()).toBe('value');
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('turns a synchronous throw into a rejection and runs the callback again afterwards', async () => {
    const error = new Error('failed');
    const callback = mock(() => Promise.resolve('value'));
    callback.mockImplementationOnce(() => {
      throw error;
    });
    const proxy = createAsyncProxy(callback);

    expect(await getRejection(proxy())).toBe(error);
    expect(await proxy()).toBe('value');
  });

  it('does not share calls between proxies', async () => {
    const { promise, resolve } = Promise.withResolvers<string>();
    const first = mock(() => promise);
    const second = mock(() => promise);

    const calls = [createAsyncProxy(first)(), createAsyncProxy(second)()];
    resolve('value');
    await Promise.all(calls);

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });
});
