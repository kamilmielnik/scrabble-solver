import { describe, expect, it, mock } from 'bun:test';

import type * as expirationManagerModule from './expirationManager';

const constructed: unknown[][] = [];

class FakeCacheExpiration {
  constructor(...parameters: unknown[]) {
    constructed.push(parameters);
  }
}

await mock.module('workbox-expiration', () => ({ CacheExpiration: FakeCacheExpiration }));

const { expirationManager }: typeof expirationManagerModule = await import('./expirationManager');

describe('expirationManager', () => {
  it('expires the dictionary cache after 30 days, in seconds', () => {
    expect(expirationManager).toBeInstanceOf(FakeCacheExpiration);
    expect(constructed).toEqual([['dictionary-api-cache', { maxAgeSeconds: 30 * 24 * 60 * 60 }]]);
  });
});
