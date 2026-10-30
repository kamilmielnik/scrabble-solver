import { describe, expect, it } from 'bun:test';

import { getHash } from './getHash';

describe('getHash', () => {
  it('returns 8 random bytes as hex by default', () => {
    expect(getHash()).toMatch(/^[0-9a-f]{16}$/);
  });

  it('returns two hex characters per requested byte', () => {
    expect(getHash(3)).toMatch(/^[0-9a-f]{6}$/);
  });

  it('returns an empty string for zero bytes', () => {
    expect(getHash(0)).toBe('');
  });

  it('never repeats itself across calls', () => {
    const hashes = Array.from({ length: 100 }, () => getHash());

    expect(new Set(hashes).size).toBe(100);
  });
});
