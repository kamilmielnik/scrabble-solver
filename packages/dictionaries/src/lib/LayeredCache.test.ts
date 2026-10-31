/* eslint-disable max-lines */

import { Gaddag } from '@kamilmielnik/gaddag';
import { Locale } from '@scrabble-solver/types';
import { afterEach, beforeEach, describe, expect, it, mock, setSystemTime } from 'bun:test';
import fs from 'fs';

import { getRejection } from '../test/getRejection';
import { redirectOutputDirectory } from '../test/redirectOutputDirectory';

import type * as DiskCacheModule from './DiskCache';
import type * as getDictionaryFilepathModule from './getDictionaryFilepath';
import type * as LayeredCacheModule from './LayeredCache';

type Age = keyof typeof AGES;

await mock.module('@scrabble-solver/logger', () => ({ logError: mock(), logEvent: mock() }));

const OUTPUT_DIRECTORY = await redirectOutputDirectory();

const { DiskCache }: typeof DiskCacheModule = await import('./DiskCache');
const { getDictionaryFilepath }: typeof getDictionaryFilepathModule = await import('./getDictionaryFilepath');
const { LayeredCache }: typeof LayeredCacheModule = await import('./LayeredCache');

const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const LOCALE = Locale.EN_US;
const NOW = Date.UTC(2026, 0, 15, 12);
const AGES = { fresh: 0, stale: 2 * DAY };

describe('LayeredCache', () => {
  let cache: InstanceType<typeof LayeredCache>;

  beforeEach(() => {
    fs.mkdirSync(OUTPUT_DIRECTORY, { recursive: true });
    setSystemTime(NOW);
    cache = new LayeredCache();
  });

  afterEach(() => {
    setSystemTime();
    fs.rmSync(OUTPUT_DIRECTORY, { force: true, recursive: true });
  });

  describe('when nothing is cached', () => {
    it('misses in every way', async () => {
      expect(cache.has(LOCALE)).toBe(false);
      expect(await cache.get(LOCALE)).toBeUndefined();
      expect(cache.getLastModifiedTimestamp(LOCALE)).toBeUndefined();
      expect(cache.isStale(LOCALE)).toBeUndefined();
    });
  });

  describe('has', () => {
    it('finds a dictionary kept only on disk', async () => {
      await writeToDisk(['disk'], NOW);

      expect(cache.has(LOCALE)).toBe(true);
    });

    it('finds a dictionary kept only in memory', async () => {
      await cache.set(LOCALE, Gaddag.fromArray(['memory']));
      removeFromDisk();

      expect(cache.has(LOCALE)).toBe(true);
    });
  });

  describe('get', () => {
    it('serves memory when it is newer than disk', async () => {
      const gaddag = Gaddag.fromArray(['memory']);
      await cache.set(LOCALE, gaddag);
      await writeToDisk(['disk'], NOW - HOUR);

      expect(await cache.get(LOCALE)).toBe(gaddag);
    });

    it('serves disk when it is newer than memory', async () => {
      await cache.set(LOCALE, Gaddag.fromArray(['memory']));
      await writeToDisk(['disk'], NOW + HOUR);

      const gaddag = await cache.get(LOCALE);

      expect(gaddag?.has('disk')).toBe(true);
      expect(gaddag?.has('memory')).toBe(false);
    });

    it('serves memory when both layers were modified at the same moment', async () => {
      const gaddag = Gaddag.fromArray(['memory']);
      await cache.set(LOCALE, gaddag);
      await writeToDisk(['disk'], NOW);

      expect(await cache.get(LOCALE)).toBe(gaddag);
    });

    it('promotes a disk hit to memory', async () => {
      await writeToDisk(['disk'], NOW - HOUR);

      const gaddag = await cache.get(LOCALE);
      removeFromDisk();

      expect(gaddag?.has('disk')).toBe(true);
      expect(await cache.get(LOCALE)).toBe(gaddag);
    });

    it('stops reading a promoted dictionary from disk', async () => {
      await writeToDisk(['disk'], NOW - HOUR);
      const gaddag = await cache.get(LOCALE);

      expect(await cache.get(LOCALE)).toBe(gaddag);
    });

    it('replaces an older memory entry with a newer disk hit', async () => {
      await cache.set(LOCALE, Gaddag.fromArray(['memory']));
      await writeToDisk(['disk'], NOW + HOUR);
      await cache.get(LOCALE);
      removeFromDisk();

      const gaddag = await cache.get(LOCALE);

      expect(gaddag?.has('disk')).toBe(true);
      expect(gaddag?.has('memory')).toBe(false);
    });

    it('misses on a corrupted file and does not promote anything to memory', async () => {
      fs.writeFileSync(getDictionaryFilepath(LOCALE), 'corrupted');

      expect(await cache.get(LOCALE)).toBeUndefined();
      expect(cache.has(LOCALE)).toBe(false);
    });

    it('keeps locales apart', async () => {
      await cache.set(LOCALE, Gaddag.fromArray(['memory']));

      expect(await cache.get(Locale.PL_PL)).toBeUndefined();
    });
  });

  describe('getLastModifiedTimestamp', () => {
    it('reports the disk timestamp of a dictionary kept only on disk', async () => {
      await writeToDisk(['disk'], NOW - HOUR);

      expect(cache.getLastModifiedTimestamp(LOCALE)).toBe(NOW - HOUR);
    });

    it('reports the memory timestamp when memory is newer', async () => {
      await cache.set(LOCALE, Gaddag.fromArray(['memory']));
      await writeToDisk(['disk'], NOW - HOUR);

      expect(cache.getLastModifiedTimestamp(LOCALE)).toBe(NOW);
    });

    it('reports the disk timestamp when disk is newer', async () => {
      await cache.set(LOCALE, Gaddag.fromArray(['memory']));
      await writeToDisk(['disk'], NOW + HOUR);

      expect(cache.getLastModifiedTimestamp(LOCALE)).toBe(NOW + HOUR);
    });
  });

  describe('isStale', () => {
    it.each<[Age | 'absent', Age | 'absent', boolean | undefined]>([
      ['absent', 'absent', undefined],
      ['absent', 'fresh', false],
      ['absent', 'stale', true],
      ['fresh', 'absent', false],
      ['fresh', 'fresh', false],
      ['fresh', 'stale', true],
      ['stale', 'absent', true],
      ['stale', 'fresh', true],
      ['stale', 'stale', true],
    ])('with memory %s and disk %s it is %p', async (memory, disk, expected) => {
      if (memory !== 'absent') {
        setSystemTime(NOW - AGES[memory]);
        await cache.set(LOCALE, Gaddag.fromArray(['memory']));
        setSystemTime(NOW);
      }

      removeFromDisk();

      if (disk !== 'absent') {
        await writeToDisk(['disk'], NOW - AGES[disk]);
      }

      expect(cache.isStale(LOCALE)).toBe(expected);
    });
  });

  describe('set', () => {
    it('writes through to disk and to memory', async () => {
      const gaddag = Gaddag.fromArray(['scrabble']);

      await cache.set(LOCALE, gaddag);
      const diskCopy = await new DiskCache(OUTPUT_DIRECTORY).get(LOCALE);
      removeFromDisk();

      expect(diskCopy?.has('scrabble')).toBe(true);
      expect(await cache.get(LOCALE)).toBe(gaddag);
    });

    it('writes to the output directory by default', async () => {
      await cache.set(LOCALE, Gaddag.fromArray(['scrabble']));

      expect(fs.readdirSync(OUTPUT_DIRECTORY)).toEqual(['en-US.gaddag']);
    });

    it('leaves memory untouched when the disk write fails', async () => {
      fs.rmSync(OUTPUT_DIRECTORY, { force: true, recursive: true });

      expect(await getRejection(cache.set(LOCALE, Gaddag.fromArray(['scrabble'])))).toBeInstanceOf(Error);
      expect(cache.has(LOCALE)).toBe(false);
    });
  });
});

async function writeToDisk(words: string[], modifiedAt: number): Promise<void> {
  const filepath = getDictionaryFilepath(LOCALE);
  await new DiskCache(OUTPUT_DIRECTORY).set(LOCALE, Gaddag.fromArray(words));
  fs.utimesSync(filepath, new Date(modifiedAt), new Date(modifiedAt));
}

function removeFromDisk(): void {
  fs.rmSync(getDictionaryFilepath(LOCALE), { force: true });
}
