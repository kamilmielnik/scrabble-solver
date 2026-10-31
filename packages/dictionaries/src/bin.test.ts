import { Gaddag } from '@kamilmielnik/gaddag';
import { Locale } from '@scrabble-solver/types';
import { afterAll, beforeEach, describe, expect, it } from 'bun:test';
import { type SpawnSyncReturns, spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

const PACKAGE_DIRECTORY = path.resolve(import.meta.dir, '..');
const STUB_WORD_LISTS = path.join(import.meta.dir, 'test', 'stubWordLists.cjs');
const HOME = fs.mkdtempSync(path.join(os.tmpdir(), 'dictionaries-bin-test-'));
const OUTPUT_DIRECTORY = path.join(HOME, '.scrabble-solver', 'dictionaries');
const ALL_LOCALES = Object.values(Locale);

afterAll(() => {
  fs.rmSync(HOME, { force: true, recursive: true });
});

assertBuiltPackageUsesTemporaryHome();

describe('bin', () => {
  beforeEach(() => {
    fs.rmSync(path.join(HOME, '.scrabble-solver'), { force: true, recursive: true });
  });

  describe('update-dictionaries', () => {
    it('builds every missing dictionary and exits with 0', () => {
      const { status } = runBin('update-dictionaries');

      expect(status).toBe(0);
      expect(fs.readdirSync(OUTPUT_DIRECTORY).toSorted()).toEqual(ALL_LOCALES.map(toFilename).toSorted());
      expect(readDictionary(Locale.EN_US).has('stubbed')).toBe(true);
    });

    it('exits with 1 when a dictionary cannot be built, so that a build does not ship without it', () => {
      const { status } = runBin('update-dictionaries', { FAILING_LOCALE: Locale.PL_PL });

      expect(status).toBe(1);
      expect(fs.readdirSync(OUTPUT_DIRECTORY).toSorted()).toEqual(
        ALL_LOCALES.filter((locale) => locale !== Locale.PL_PL)
          .map(toFilename)
          .toSorted(),
      );
    });

    it('leaves fresh dictionaries alone', () => {
      runBin('update-dictionaries');

      const { status } = runBin('update-dictionaries', { FAILING_LOCALE: Locale.PL_PL });

      expect(status).toBe(0);
    });
  });

  describe('remove-dictionaries', () => {
    it('deletes the output directory', () => {
      fs.mkdirSync(OUTPUT_DIRECTORY, { recursive: true });
      fs.writeFileSync(path.join(OUTPUT_DIRECTORY, toFilename(Locale.EN_US)), 'dictionary');

      const { status } = runBin('remove-dictionaries');

      expect(status).toBe(0);
      expect(fs.existsSync(OUTPUT_DIRECTORY)).toBe(false);
    });

    it('does not fail when there is nothing to remove', () => {
      const { status } = runBin('remove-dictionaries');

      expect(status).toBe(0);
      expect(fs.existsSync(OUTPUT_DIRECTORY)).toBe(false);
    });
  });
});

/**
 * Throws at load time, so no test can run a script that would see the developer's real dictionary cache.
 * The scripts run the built package, where mock.module cannot reach: only HOME keeps them away from it.
 */
function assertBuiltPackageUsesTemporaryHome(): void {
  const builtConstants = path.join(PACKAGE_DIRECTORY, 'build', 'constants.js');
  const script = `process.stdout.write(require(${JSON.stringify(builtConstants)}).OUTPUT_DIRECTORY)`;
  const { stdout } = spawnNode(['--eval', script]);

  if (stdout !== OUTPUT_DIRECTORY) {
    throw new Error(`Expected the built package to use ${OUTPUT_DIRECTORY} but it uses "${stdout}"`);
  }
}

function runBin(name: string, env: Record<string, string> = {}): SpawnSyncReturns<string> {
  return spawnNode(['--require', STUB_WORD_LISTS, path.join(PACKAGE_DIRECTORY, 'bin', `${name}.js`)], env);
}

function spawnNode(args: string[], env: Record<string, string> = {}): SpawnSyncReturns<string> {
  return spawnSync('node', args, {
    cwd: HOME,
    encoding: 'utf8',
    env: { HOME, PATH: process.env.PATH, USERPROFILE: HOME, ...env },
  });
}

function readDictionary(locale: Locale): Gaddag {
  return Gaddag.deserialize(fs.readFileSync(path.join(OUTPUT_DIRECTORY, toFilename(locale))));
}

function toFilename(locale: Locale): string {
  return `${locale}.gaddag`;
}
