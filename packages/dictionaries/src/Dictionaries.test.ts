/* eslint-disable max-lines */

import { Gaddag } from '@kamilmielnik/gaddag';
import { Locale } from '@scrabble-solver/types';
import { afterEach, beforeEach, describe, expect, it, mock, setSystemTime } from 'bun:test';
import fs from 'fs';

import type * as DictionariesModule from './Dictionaries';
import type * as DiskCacheModule from './lib/DiskCache';
import type * as getDictionaryFilepathModule from './lib/getDictionaryFilepath';
import { getRejection } from './test/getRejection';
import { redirectOutputDirectory } from './test/redirectOutputDirectory';

const getWordList = mock<(locale: Locale) => Promise<string[]>>();
const logError = mock();
const logEvent = mock<(event: { locale: Locale }) => void>();

await mock.module('@scrabble-solver/logger', () => ({ logError, logEvent }));
await mock.module('@scrabble-solver/word-lists', () => ({ getWordList }));

const OUTPUT_DIRECTORY = await redirectOutputDirectory();

const { Dictionaries }: typeof DictionariesModule = await import('./Dictionaries');
const { DiskCache }: typeof DiskCacheModule = await import('./lib/DiskCache');
const { getDictionaryFilepath }: typeof getDictionaryFilepathModule = await import('./lib/getDictionaryFilepath');

const ALL_LOCALES = Object.values(Locale);
const CACHED_WORD = 'cached';
const DOWNLOADED_WORD = 'downloaded';
const LOCALE = Locale.EN_US;
const STALE_AGE = 2 * 24 * 60 * 60 * 1000;

describe('Dictionaries', () => {
  let dictionaries: InstanceType<typeof Dictionaries>;

  beforeEach(() => {
    fs.rmSync(OUTPUT_DIRECTORY, { force: true, recursive: true });
    getWordList.mockReset();
    getWordList.mockResolvedValue([DOWNLOADED_WORD]);
    logError.mockReset();
    logEvent.mockReset();
    dictionaries = new Dictionaries();
  });

  afterEach(() => {
    setSystemTime();
  });

  describe('get', () => {
    it('downloads a dictionary that is not cached and saves it', async () => {
      const gaddag = await dictionaries.get(LOCALE);

      expect(gaddag.has(DOWNLOADED_WORD)).toBe(true);
      expect(getWordList).toHaveBeenCalledWith(LOCALE);
      expect((await readFromDisk(LOCALE))?.has(DOWNLOADED_WORD)).toBe(true);
    });

    it('creates the output directory on the first download', async () => {
      expect(fs.existsSync(OUTPUT_DIRECTORY)).toBe(false);

      await dictionaries.get(LOCALE);

      expect(fs.readdirSync(OUTPUT_DIRECTORY)).toEqual([`${LOCALE}.gaddag`]);
    });

    it('does not download a dictionary twice', async () => {
      await dictionaries.get(LOCALE);
      const gaddag = await dictionaries.get(LOCALE);

      expect(gaddag.has(DOWNLOADED_WORD)).toBe(true);
      expect(getWordList).toHaveBeenCalledTimes(1);
    });

    it('serves a dictionary cached on disk without downloading it', async () => {
      await writeToDisk(LOCALE);

      const gaddag = await dictionaries.get(LOCALE);

      expect(gaddag.has(CACHED_WORD)).toBe(true);
      expect(getWordList).not.toHaveBeenCalled();
    });

    it('serves a dictionary from memory after the file disappeared', async () => {
      await writeToDisk(LOCALE);
      await dictionaries.get(LOCALE);
      fs.rmSync(getDictionaryFilepath(LOCALE));

      const gaddag = await dictionaries.get(LOCALE);

      expect(gaddag.has(CACHED_WORD)).toBe(true);
      expect(getWordList).not.toHaveBeenCalled();
    });

    it('downloads again when the cached file cannot be deserialized, replacing the file', async () => {
      fs.mkdirSync(OUTPUT_DIRECTORY, { recursive: true });
      fs.writeFileSync(getDictionaryFilepath(LOCALE), 'serialized trie from a previous app version');

      const gaddag = await dictionaries.get(LOCALE);

      expect(gaddag.has(DOWNLOADED_WORD)).toBe(true);
      expect(getWordList).toHaveBeenCalledTimes(1);
      expect((await readFromDisk(LOCALE))?.has(DOWNLOADED_WORD)).toBe(true);
      expect(logError).toHaveBeenCalledWith('cache', expect.any(Error), { level: 'warn', locale: LOCALE });
    });

    it('serves a stale file as it is', async () => {
      await writeToDisk(LOCALE);
      age(LOCALE);
      const modifiedAt = fs.statSync(getDictionaryFilepath(LOCALE)).mtimeMs;

      const gaddag = await dictionaries.get(LOCALE);

      expect(gaddag.has(CACHED_WORD)).toBe(true);
      expect(getWordList).not.toHaveBeenCalled();
      expect(fs.statSync(getDictionaryFilepath(LOCALE)).mtimeMs).toBe(modifiedAt);
    });

    it('serves a stale memory entry as it is', async () => {
      await dictionaries.get(LOCALE);
      setSystemTime(Date.now() + STALE_AGE);

      const gaddag = await dictionaries.get(LOCALE);

      expect(gaddag.has(DOWNLOADED_WORD)).toBe(true);
      expect(getWordList).toHaveBeenCalledTimes(1);
    });

    it('rejects when the download fails, saves nothing and downloads again on retry', async () => {
      const error = new Error('upstream is down');
      getWordList.mockRejectedValueOnce(error);

      expect(await getRejection(dictionaries.get(LOCALE))).toBe(error);
      expect(fs.existsSync(getDictionaryFilepath(LOCALE))).toBe(false);

      const gaddag = await dictionaries.get(LOCALE);

      expect(gaddag.has(DOWNLOADED_WORD)).toBe(true);
      expect(getWordList).toHaveBeenCalledTimes(2);
    });

    it('rejects when a corrupted file cannot be replaced because the download fails', async () => {
      fs.mkdirSync(OUTPUT_DIRECTORY, { recursive: true });
      fs.writeFileSync(getDictionaryFilepath(LOCALE), 'corrupted');
      const error = new Error('upstream is down');
      getWordList.mockRejectedValue(error);

      expect(await getRejection(dictionaries.get(LOCALE))).toBe(error);
    });

    it('coalesces concurrent downloads of one locale', async () => {
      const { promise, resolve } = Promise.withResolvers<string[]>();
      getWordList.mockReturnValue(promise);

      const calls = [dictionaries.get(LOCALE), dictionaries.get(LOCALE)];
      resolve([DOWNLOADED_WORD]);
      const [first, second] = await Promise.all(calls);

      expect(getWordList).toHaveBeenCalledTimes(1);
      expect(first).toBe(second);
    });

    it('downloads different locales separately', async () => {
      await Promise.all([dictionaries.get(Locale.EN_US), dictionaries.get(Locale.PL_PL)]);

      expect(downloadedLocales()).toEqual([Locale.EN_US, Locale.PL_PL].toSorted());
    });
  });

  describe('update', () => {
    it('downloads nothing when every dictionary is fresh', async () => {
      await writeToDisk(...ALL_LOCALES);

      expect(await dictionaries.update()).toEqual([]);
      expect(getWordList).not.toHaveBeenCalled();
    });

    it('builds every dictionary when nothing is cached', async () => {
      expect(await dictionaries.update()).toEqual([]);

      expect(downloadedLocales()).toEqual(ALL_LOCALES.toSorted());
      expect(fs.readdirSync(OUTPUT_DIRECTORY).toSorted()).toEqual(
        ALL_LOCALES.map((locale) => `${locale}.gaddag`).toSorted(),
      );
    });

    it('updates only the stale and the missing dictionaries', async () => {
      const [stale, missing, ...fresh] = ALL_LOCALES;
      await writeToDisk(...fresh);
      await writeToDisk(stale);
      age(stale);

      expect(await dictionaries.update()).toEqual([]);

      expect(downloadedLocales()).toEqual([missing, stale].toSorted());
      expect((await readFromDisk(stale))?.has(DOWNLOADED_WORD)).toBe(true);
      expect((await readFromDisk(missing))?.has(DOWNLOADED_WORD)).toBe(true);
      expect((await readFromDisk(fresh[0]))?.has(CACHED_WORD)).toBe(true);
    });

    it('treats a falsy force like no force', async () => {
      await writeToDisk(...ALL_LOCALES);

      await dictionaries.update(false);

      expect(getWordList).not.toHaveBeenCalled();
    });

    it('updates every dictionary when forced, even the fresh ones', async () => {
      await writeToDisk(...ALL_LOCALES);

      expect(await dictionaries.update(true)).toEqual([]);

      expect(downloadedLocales()).toEqual(ALL_LOCALES.toSorted());
      expect((await readFromDisk(LOCALE))?.has(DOWNLOADED_WORD)).toBe(true);
    });

    it('leaves nothing to do for the next update', async () => {
      await dictionaries.update();
      getWordList.mockClear();

      expect(await dictionaries.update()).toEqual([]);

      expect(getWordList).not.toHaveBeenCalled();
    });

    it('serves the updated dictionary instead of the one it had in memory', async () => {
      await writeToDisk(LOCALE);
      await dictionaries.get(LOCALE);

      await dictionaries.update(true);
      const gaddag = await dictionaries.get(LOCALE);

      expect(gaddag.has(DOWNLOADED_WORD)).toBe(true);
      expect(gaddag.has(CACHED_WORD)).toBe(false);
    });

    it('logs a build event for every dictionary it built', async () => {
      await dictionaries.update();

      expect(logEvent.mock.calls.map(([event]) => event.locale).toSorted()).toEqual(ALL_LOCALES.toSorted());
    });

    it('returns and logs the locales it failed to build, and still builds the others', async () => {
      const error = new Error('upstream is down');
      const failing = [Locale.FA_IR, Locale.PL_PL];
      getWordList.mockImplementation((locale) => {
        return failing.includes(locale) ? Promise.reject(error) : Promise.resolve([DOWNLOADED_WORD]);
      });

      expect((await dictionaries.update()).toSorted()).toEqual(failing.toSorted());

      expect(logError).toHaveBeenCalledTimes(failing.length);
      expect(logError).toHaveBeenCalledWith('build', error, { locale: Locale.FA_IR });
      expect(logError).toHaveBeenCalledWith('build', error, { locale: Locale.PL_PL });
      expect(fs.readdirSync(OUTPUT_DIRECTORY).toSorted()).toEqual(
        ALL_LOCALES.filter((locale) => !failing.includes(locale))
          .map((locale) => `${locale}.gaddag`)
          .toSorted(),
      );
    });

    it('returns the failed locales in the order of the Locale enum', async () => {
      getWordList.mockRejectedValue(new Error('upstream is down'));

      expect(await dictionaries.update()).toEqual(ALL_LOCALES);
    });

    it('keeps serving a stale dictionary when it fails to refresh it', async () => {
      await writeToDisk(...ALL_LOCALES);
      age(LOCALE);
      getWordList.mockRejectedValue(new Error('upstream is down'));

      expect(await dictionaries.update()).toEqual([LOCALE]);

      expect((await dictionaries.get(LOCALE)).has(CACHED_WORD)).toBe(true);
    });

    it('reports a dictionary it built but could not write', async () => {
      await writeToDisk(...ALL_LOCALES.filter((locale) => locale !== LOCALE));
      fs.mkdirSync(getDictionaryFilepath(LOCALE));

      expect(await dictionaries.update(true)).toEqual([LOCALE]);

      expect(logError).toHaveBeenCalledWith('build', expect.any(Error), { locale: LOCALE });
    });

    it('reports every locale when the output directory cannot be created', async () => {
      fs.writeFileSync(OUTPUT_DIRECTORY, 'a file in the way');

      expect(await dictionaries.update()).toEqual(ALL_LOCALES);

      expect(getWordList).not.toHaveBeenCalled();
      expect(logError).toHaveBeenCalledTimes(ALL_LOCALES.length);
    });

    it('shares its download with a get that started later', async () => {
      const { promise, resolve } = Promise.withResolvers<string[]>();
      getWordList.mockReturnValue(promise);

      const update = dictionaries.update();
      const get = dictionaries.get(LOCALE);
      resolve([DOWNLOADED_WORD]);
      const [failedLocales, gaddag] = await Promise.all([update, get]);

      expect(failedLocales).toEqual([]);
      expect(gaddag.has(DOWNLOADED_WORD)).toBe(true);
      expect(downloadedLocales()).toEqual(ALL_LOCALES.toSorted());
    });

    it('shares the download of a get that started earlier', async () => {
      const { promise, resolve } = Promise.withResolvers<string[]>();
      getWordList.mockReturnValue(promise);

      const get = dictionaries.get(LOCALE);
      const update = dictionaries.update();
      resolve([DOWNLOADED_WORD]);
      await Promise.all([update, get]);

      expect(downloadedLocales()).toEqual(ALL_LOCALES.toSorted());
    });
  });

  describe('remove', () => {
    it('deletes the output directory with every cached dictionary', async () => {
      await writeToDisk(...ALL_LOCALES);

      dictionaries.remove();

      expect(fs.existsSync(OUTPUT_DIRECTORY)).toBe(false);
    });

    it('makes the next instance download the dictionary again', async () => {
      await writeToDisk(LOCALE);

      dictionaries.remove();
      const gaddag = await new Dictionaries().get(LOCALE);

      expect(gaddag.has(DOWNLOADED_WORD)).toBe(true);
      expect(getWordList).toHaveBeenCalledTimes(1);
    });

    it('does nothing when the output directory does not exist', () => {
      expect(fs.existsSync(OUTPUT_DIRECTORY)).toBe(false);

      expect(() => {
        dictionaries.remove();
      }).not.toThrow();
    });
  });
});

async function writeToDisk(...locales: Locale[]): Promise<void> {
  fs.mkdirSync(OUTPUT_DIRECTORY, { recursive: true });

  for (const locale of locales) {
    await new DiskCache(OUTPUT_DIRECTORY).set(locale, Gaddag.fromArray([CACHED_WORD]));
  }
}

function age(locale: Locale): void {
  const modifiedAt = new Date(Date.now() - STALE_AGE);
  fs.utimesSync(getDictionaryFilepath(locale), modifiedAt, modifiedAt);
}

function readFromDisk(locale: Locale): Promise<Gaddag | undefined> {
  return new DiskCache(OUTPUT_DIRECTORY).get(locale);
}

function downloadedLocales(): Locale[] {
  return getWordList.mock.calls.map(([locale]) => locale).toSorted();
}
