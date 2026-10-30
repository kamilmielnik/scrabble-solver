import { describe, expect, it } from 'bun:test';
import os from 'os';
import path from 'path';

import { CACHE_STALE_THRESHOLD, DAY, OUTPUT_DIRECTORY } from './constants';

describe('constants', () => {
  it('treats cache entries as stale after one day', () => {
    expect(DAY).toBe(86_400_000);
    expect(CACHE_STALE_THRESHOLD).toBe(DAY);
  });

  it('keeps dictionaries in the home directory', () => {
    expect(OUTPUT_DIRECTORY).toBe(path.join(os.homedir(), '.scrabble-solver', 'dictionaries'));
  });
});
