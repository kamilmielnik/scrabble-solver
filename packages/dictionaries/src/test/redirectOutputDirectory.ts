import { Locale } from '@scrabble-solver/types';
import { afterAll, mock } from 'bun:test';
import fs from 'fs';
import os from 'os';
import path from 'path';

import type * as constantsModule from '../constants';
import type * as getDictionaryFilepathModule from '../lib/getDictionaryFilepath';

/**
 * OUTPUT_DIRECTORY is the developer's real dictionary cache and `Dictionaries.remove()` deletes it.
 * Await this before importing anything that reads, writes or removes it: it throws, failing the whole
 * test file before any test runs, unless production code itself reports the temporary directory.
 * The real constants come back after the test file, because module mocks outlive it.
 */
export async function redirectOutputDirectory(): Promise<string> {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dictionaries-test-'));
  const directory = path.join(root, 'dictionaries');
  const realConstants: typeof constantsModule = { ...(await import('../constants')) };

  afterAll(async () => {
    fs.rmSync(root, { force: true, recursive: true });
    await mock.module('../constants', () => realConstants);
  });

  await mock.module('../constants', () => ({ ...realConstants, OUTPUT_DIRECTORY: directory }));

  const { OUTPUT_DIRECTORY }: typeof constantsModule = await import('../constants');
  const { getDictionaryFilepath }: typeof getDictionaryFilepathModule = await import('../lib/getDictionaryFilepath');
  const effectiveDirectories = [OUTPUT_DIRECTORY, path.dirname(getDictionaryFilepath(Locale.EN_US))];

  if (effectiveDirectories.some((effectiveDirectory) => effectiveDirectory !== directory)) {
    throw new Error(`OUTPUT_DIRECTORY was not redirected to ${directory}: ${effectiveDirectories.join(', ')}`);
  }

  return directory;
}
