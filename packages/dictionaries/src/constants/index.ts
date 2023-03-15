import os from 'os';
import path from 'path';

export const DAY = 24 * 60 * 60 * 1000;

export const CACHE_STALE_THRESHOLD = 1 * DAY; // eslint-disable-line no-implicit-coercion

const ROOT_DIRECTORY = process.env.CI ? '/tmp' : os.homedir();

export const OUTPUT_DIRECTORY = path.resolve(ROOT_DIRECTORY, '.scrabble-solver', 'dictionaries');
