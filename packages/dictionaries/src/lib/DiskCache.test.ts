/* eslint-disable max-lines */

import { Gaddag } from '@kamilmielnik/gaddag';
import { Locale } from '@scrabble-solver/types';
import { afterEach, beforeEach, describe, expect, it, mock, setSystemTime, spyOn } from 'bun:test';
import fs from 'fs';
import os from 'os';
import path from 'path';

import { CACHE_STALE_THRESHOLD, DAY } from '../constants';
import { getRejection } from '../test/getRejection';

import type * as DiskCacheModule from './DiskCache';
import { getDictionaryFilepath } from './getDictionaryFilepath';

const logError = mock();

await mock.module('@scrabble-solver/logger', () => ({ logError, logEvent: mock() }));

const { DiskCache }: typeof DiskCacheModule = await import('./DiskCache');

const LOCALE = Locale.EN_US;
const MODIFIED_AT = Date.UTC(2026, 0, 15, 12);
const WORDS = ['scrabble', 'solver', 'gaddag'];

describe('DiskCache', () => {
  let directory: string;
  let cache: InstanceType<typeof DiskCache>;

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'dictionaries-test-'));
    cache = new DiskCache(directory);
    logError.mockReset();
  });

  afterEach(() => {
    setSystemTime();
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

  it('reports files older than the stale threshold as stale', async () => {
    await cache.set(LOCALE, Gaddag.fromArray(WORDS));

    const filepath = getDictionaryFilepath(LOCALE, directory);
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    fs.utimesSync(filepath, twoDaysAgo, twoDaysAgo);

    expect(cache.isStale(LOCALE)).toBe(true);
  });

  it.each([
    ['an empty file', () => new Uint8Array(0)],
    ['a file cut inside the header', () => serialize().subarray(0, 4)],
    ['a file missing its last byte', () => serialize().subarray(0, -1)],
    ['a file with a damaged last byte', () => damageLastByte(serialize())],
  ])('deletes %s and logs it as an expected failure', async (_, createContent) => {
    const filepath = getDictionaryFilepath(LOCALE, directory);
    fs.writeFileSync(filepath, createContent());

    expect(await cache.get(LOCALE)).toBeUndefined();

    expect(fs.existsSync(filepath)).toBe(false);
    expect(logError).toHaveBeenCalledTimes(1);
    expect(logError).toHaveBeenCalledWith('cache', expect.any(Error), { level: 'warn', locale: LOCALE });
  });

  it('forgets everything about a deleted file', async () => {
    fs.writeFileSync(getDictionaryFilepath(LOCALE, directory), 'corrupted');

    await cache.get(LOCALE);

    expect(cache.isStale(LOCALE)).toBeUndefined();
    expect(cache.getLastModifiedTimestamp(LOCALE)).toBeUndefined();
    expect(await cache.get(LOCALE)).toBeUndefined();
    expect(logError).toHaveBeenCalledTimes(1);
  });

  it('accepts a dictionary again after deleting a corrupted file', async () => {
    fs.writeFileSync(getDictionaryFilepath(LOCALE, directory), 'corrupted');
    await cache.get(LOCALE);

    await cache.set(LOCALE, Gaddag.fromArray(WORDS));

    expect((await cache.get(LOCALE))?.has('scrabble')).toBe(true);
  });

  it('leaves the dictionaries of other locales alone when deleting a corrupted file', async () => {
    await cache.set(Locale.PL_PL, Gaddag.fromArray(WORDS));
    fs.writeFileSync(getDictionaryFilepath(LOCALE, directory), 'corrupted');

    await cache.get(LOCALE);

    expect((await cache.get(Locale.PL_PL))?.has('scrabble')).toBe(true);
  });

  it('keeps a valid file and logs nothing when reading it', async () => {
    await cache.set(LOCALE, Gaddag.fromArray(WORDS));

    await cache.get(LOCALE);

    expect(cache.has(LOCALE)).toBe(true);
    expect(logError).not.toHaveBeenCalled();
  });

  it('replaces a dictionary on another set', async () => {
    await cache.set(LOCALE, Gaddag.fromArray(WORDS));

    await cache.set(LOCALE, Gaddag.fromArray(['replacement']));
    const gaddag = await cache.get(LOCALE);

    expect(gaddag?.has('replacement')).toBe(true);
    expect(gaddag?.has('scrabble')).toBe(false);
  });

  it('keeps locales apart', async () => {
    await cache.set(LOCALE, Gaddag.fromArray(WORDS));

    expect(cache.has(Locale.PL_PL)).toBe(false);
    expect(await cache.get(Locale.PL_PL)).toBeUndefined();
  });

  it('reports the modification time of the file', async () => {
    await writeFileModifiedAt(cache, directory);

    expect(cache.getLastModifiedTimestamp(LOCALE)).toBe(MODIFIED_AT);
  });

  it('stays fresh up to and including the stale threshold and turns stale right after it', async () => {
    await writeFileModifiedAt(cache, directory);

    setSystemTime(MODIFIED_AT + CACHE_STALE_THRESHOLD);
    expect(cache.isStale(LOCALE)).toBe(false);

    setSystemTime(MODIFIED_AT + CACHE_STALE_THRESHOLD + 1);
    expect(cache.isStale(LOCALE)).toBe(true);
  });

  it('measures staleness in both directions for a file from the future', async () => {
    await writeFileModifiedAt(cache, directory);

    setSystemTime(MODIFIED_AT - CACHE_STALE_THRESHOLD);
    expect(cache.isStale(LOCALE)).toBe(false);

    setSystemTime(MODIFIED_AT - CACHE_STALE_THRESHOLD - 1);
    expect(cache.isStale(LOCALE)).toBe(true);
  });

  it('never lets a concurrent reader see, and delete, a file that is still being written', async () => {
    await cache.set(LOCALE, Gaddag.fromArray(WORDS));
    const filepath = getDictionaryFilepath(LOCALE, directory);
    const previousFile = fs.readFileSync(filepath);
    const { writeFile } = fs.promises;
    const writeFileSpy = spyOn(fs.promises, 'writeFile').mockImplementation(async (...args) => {
      await writeFile(...args);
      expect(fs.readFileSync(filepath)).toEqual(previousFile);
    });

    await cache.set(LOCALE, Gaddag.fromArray(['replacement']));

    expect(writeFileSpy).toHaveBeenCalledTimes(1);
    writeFileSpy.mockRestore();
    expect((await cache.get(LOCALE))?.has('replacement')).toBe(true);
    expect(fs.readdirSync(directory)).toEqual([path.basename(filepath)]);
  });

  describe('temporary files', () => {
    it('removes the temporary file and keeps the previous dictionary when writing fails', async () => {
      await cache.set(LOCALE, Gaddag.fromArray(WORDS));
      const filepath = getDictionaryFilepath(LOCALE, directory);
      const error = new Error('ENOSPC');
      const writeFileSpy = spyOn(fs.promises, 'writeFile').mockImplementation(async (file) => {
        fs.writeFileSync(file as string, 'partially written');
        throw error;
      });

      expect(await getRejection(cache.set(LOCALE, Gaddag.fromArray(['replacement'])))).toBe(error);
      writeFileSpy.mockRestore();

      expect(fs.readdirSync(directory)).toEqual([path.basename(filepath)]);
      expect((await cache.get(LOCALE))?.has('scrabble')).toBe(true);
    });

    it('removes the temporary file when replacing the dictionary fails', async () => {
      const error = new Error('EACCES');
      const renameSpy = spyOn(fs.promises, 'rename').mockRejectedValue(error);

      expect(await getRejection(cache.set(LOCALE, Gaddag.fromArray(WORDS)))).toBe(error);
      renameSpy.mockRestore();

      expect(fs.readdirSync(directory)).toEqual([]);
    });

    it('removes a temporary file abandoned by a killed process', async () => {
      const abandonedFilepath = `${getDictionaryFilepath(Locale.PL_PL, directory)}.abandoned.tmp`;
      fs.writeFileSync(abandonedFilepath, 'partially written');
      const twoDaysAgo = new Date(Date.now() - 2 * DAY);
      fs.utimesSync(abandonedFilepath, twoDaysAgo, twoDaysAgo);

      await cache.set(LOCALE, Gaddag.fromArray(WORDS));

      expect(fs.existsSync(abandonedFilepath)).toBe(false);
    });

    it('leaves alone a temporary file of a concurrent write', async () => {
      const concurrentFilepath = `${getDictionaryFilepath(LOCALE, directory)}.concurrent.tmp`;
      fs.writeFileSync(concurrentFilepath, 'still being written');

      await cache.set(LOCALE, Gaddag.fromArray(WORDS));

      expect(fs.existsSync(concurrentFilepath)).toBe(true);
    });
  });
});

async function writeFileModifiedAt(cache: InstanceType<typeof DiskCache>, directory: string): Promise<void> {
  await cache.set(LOCALE, Gaddag.fromArray(WORDS));
  fs.utimesSync(getDictionaryFilepath(LOCALE, directory), new Date(MODIFIED_AT), new Date(MODIFIED_AT));
}

function serialize(): Uint8Array {
  return Gaddag.fromArray(WORDS).serialize();
}

function damageLastByte(serialized: Uint8Array): Uint8Array {
  const damaged = serialized.slice();
  damaged[damaged.length - 1] = 255 - damaged[damaged.length - 1];
  return damaged;
}
