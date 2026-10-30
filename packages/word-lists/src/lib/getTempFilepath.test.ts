import { describe, expect, it } from 'bun:test';
import os from 'os';
import path from 'path';

import { installTempFileSandbox } from '../test/installTempFileSandbox';

import type * as getTempFilepathModule from './getTempFilepath';

const tempFiles = installTempFileSandbox();
const { getTempFilepath }: typeof getTempFilepathModule = await import('./getTempFilepath');

describe('getTempFilepath', () => {
  it('points at the .scrabble-solver directory of the home directory', () => {
    expect(path.dirname(getTempFilepath())).toBe(path.join(os.homedir(), '.scrabble-solver'));
  });

  it('names the file after a random hash', () => {
    expect(path.basename(getTempFilepath())).toMatch(/^[0-9a-f]{16}\.txt$/);
  });

  it('returns a different path on every call', () => {
    expect(getTempFilepath()).not.toBe(getTempFilepath());
  });

  it('stays inside the OS temp directory under test', () => {
    expect(getTempFilepath()).toStartWith(tempFiles.directory);
    expect(tempFiles.directory).toStartWith(os.tmpdir());
  });

  it('only computes a path and creates nothing', () => {
    getTempFilepath();

    expect(tempFiles.listFiles()).toEqual([]);
  });
});
