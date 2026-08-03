import { Gaddag } from '@kamilmielnik/gaddag';
import { Locale } from '@scrabble-solver/types';
import fs from 'fs';
import os from 'os';
import path from 'path';

import { DiskCache } from './DiskCache';
import { getDictionaryFilepath, getLegacyDictionaryFilepath } from './getDictionaryFilepath';

const LOCALE = Locale.EN_US;
const WORDS = ['scrabble', 'solver', 'gaddag'];

describe('DiskCache', () => {
  let directory: string;
  let cache: DiskCache;

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'dictionaries-test-'));
    cache = new DiskCache(directory);
  });

  afterEach(() => {
    fs.rmSync(directory, { force: true, recursive: true });
  });

  it('misses when there is no file', async () => {
    expect(cache.has(LOCALE)).toBe(false);
    expect(await cache.get(LOCALE)).toBeUndefined();
    expect(cache.isStale(LOCALE)).toBeUndefined();
    expect(cache.getLastModifiedTimestamp(LOCALE)).toBeUndefined();
  });

  it('round-trips a dictionary', async () => {
    await cache.set(LOCALE, Gaddag.fromArray(WORDS));

    expect(cache.has(LOCALE)).toBe(true);
    expect(cache.isStale(LOCALE)).toBe(false);

    const gaddag = await cache.get(LOCALE);

    for (const word of WORDS) {
      expect(gaddag?.has(word)).toBe(true);
    }

    expect(gaddag?.has('trie')).toBe(false);
  });

  it('treats a file written in an incompatible format as a cache miss and removes it', async () => {
    const filepath = getDictionaryFilepath(LOCALE, directory);
    fs.writeFileSync(filepath, 'serialized trie from a previous app version');

    expect(cache.has(LOCALE)).toBe(true);
    expect(await cache.get(LOCALE)).toBeUndefined();
    expect(cache.has(LOCALE)).toBe(false);
  });

  it('treats a corrupted (truncated) file as a cache miss and removes it', async () => {
    const serialized = Gaddag.fromArray(WORDS).serialize();
    const filepath = getDictionaryFilepath(LOCALE, directory);
    fs.writeFileSync(filepath, serialized.subarray(0, 10));

    expect(await cache.get(LOCALE)).toBeUndefined();
    expect(cache.has(LOCALE)).toBe(false);
  });

  it('removes the legacy pre-gaddag cache file when writing', async () => {
    const legacyFilepath = getLegacyDictionaryFilepath(LOCALE, directory);
    fs.writeFileSync(legacyFilepath, 'serialized trie');

    await cache.set(LOCALE, Gaddag.fromArray(WORDS));

    expect(fs.existsSync(legacyFilepath)).toBe(false);
    expect(cache.has(LOCALE)).toBe(true);
  });

  it('reports files older than the stale threshold as stale', async () => {
    await cache.set(LOCALE, Gaddag.fromArray(WORDS));

    const filepath = getDictionaryFilepath(LOCALE, directory);
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    fs.utimesSync(filepath, twoDaysAgo, twoDaysAgo);

    expect(cache.isStale(LOCALE)).toBe(true);
  });
});
