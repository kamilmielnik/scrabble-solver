import { Gaddag } from '@kamilmielnik/gaddag';
import { Locale } from '@scrabble-solver/types';
import { afterEach, beforeEach, describe, expect, it, setSystemTime } from 'bun:test';

import { CACHE_STALE_THRESHOLD } from '../constants';

import { MemoryCache } from './MemoryCache';

const LOCALE = Locale.EN_US;
const NOW = Date.UTC(2026, 0, 15, 12);

describe('MemoryCache', () => {
  let cache: MemoryCache;

  beforeEach(() => {
    setSystemTime(NOW);
    cache = new MemoryCache();
  });

  afterEach(() => {
    setSystemTime();
  });

  it('misses when nothing was set', async () => {
    expect(cache.has(LOCALE)).toBe(false);
    expect(await cache.get(LOCALE)).toBeUndefined();
    expect(cache.getLastModifiedTimestamp(LOCALE)).toBeUndefined();
    expect(cache.isStale(LOCALE)).toBeUndefined();
  });

  it('returns the very dictionary that was set', async () => {
    const gaddag = Gaddag.fromArray(['scrabble']);

    await cache.set(LOCALE, gaddag);

    expect(cache.has(LOCALE)).toBe(true);
    expect(await cache.get(LOCALE)).toBe(gaddag);
  });

  it('keeps locales apart', async () => {
    await cache.set(LOCALE, Gaddag.fromArray(['scrabble']));

    expect(cache.has(Locale.PL_PL)).toBe(false);
    expect(await cache.get(Locale.PL_PL)).toBeUndefined();
    expect(cache.getLastModifiedTimestamp(Locale.PL_PL)).toBeUndefined();
    expect(cache.isStale(Locale.PL_PL)).toBeUndefined();
  });

  it('does not share entries between instances', async () => {
    await cache.set(LOCALE, Gaddag.fromArray(['scrabble']));

    expect(new MemoryCache().has(LOCALE)).toBe(false);
  });

  it('records when a dictionary was set', async () => {
    await cache.set(LOCALE, Gaddag.fromArray(['scrabble']));

    expect(cache.getLastModifiedTimestamp(LOCALE)).toBe(NOW);
  });

  it('replaces the dictionary and refreshes the timestamp on another set', async () => {
    const replacement = Gaddag.fromArray(['solver']);
    await cache.set(LOCALE, Gaddag.fromArray(['scrabble']));
    setSystemTime(NOW + CACHE_STALE_THRESHOLD + 1);

    await cache.set(LOCALE, replacement);

    expect(await cache.get(LOCALE)).toBe(replacement);
    expect(cache.getLastModifiedTimestamp(LOCALE)).toBe(NOW + CACHE_STALE_THRESHOLD + 1);
    expect(cache.isStale(LOCALE)).toBe(false);
  });

  it('stays fresh up to and including the stale threshold', async () => {
    await cache.set(LOCALE, Gaddag.fromArray(['scrabble']));

    setSystemTime(NOW + CACHE_STALE_THRESHOLD);

    expect(cache.isStale(LOCALE)).toBe(false);
  });

  it('turns stale right after the stale threshold', async () => {
    await cache.set(LOCALE, Gaddag.fromArray(['scrabble']));

    setSystemTime(NOW + CACHE_STALE_THRESHOLD + 1);

    expect(cache.isStale(LOCALE)).toBe(true);
  });

  it('measures staleness in both directions when the clock moved back', async () => {
    await cache.set(LOCALE, Gaddag.fromArray(['scrabble']));

    setSystemTime(NOW - CACHE_STALE_THRESHOLD);
    expect(cache.isStale(LOCALE)).toBe(false);

    setSystemTime(NOW - CACHE_STALE_THRESHOLD - 1);
    expect(cache.isStale(LOCALE)).toBe(true);
  });

  it('keeps serving a stale dictionary', async () => {
    const gaddag = Gaddag.fromArray(['scrabble']);
    await cache.set(LOCALE, gaddag);

    setSystemTime(NOW + 2 * CACHE_STALE_THRESHOLD);

    expect(cache.has(LOCALE)).toBe(true);
    expect(await cache.get(LOCALE)).toBe(gaddag);
  });
});
