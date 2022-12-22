import os from 'os';
import path from 'path';

export const DAY = 24 * 60 * 60 * 1000;

export const CACHE_STALE_THRESHOLD = 1 * DAY;

export const OUTPUT_DIRECTORY = path.resolve(os.homedir(), '.scrabble-solver', 'dictionaries');
