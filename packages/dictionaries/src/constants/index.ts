import os from 'os';
import path from 'path';

const DEFAULT_SCRABBLE_SOLVER_DIRECTORY = path.resolve(os.homedir(), '.scrabble-solver');
const SCRABBLE_SOLVER_DIRECTORY = process.env.SCRABBLE_SOLVER_DIRECTORY || DEFAULT_SCRABBLE_SOLVER_DIRECTORY;

export const DAY = 24 * 60 * 60 * 1000;

export const CACHE_STALE_THRESHOLD = 1 * DAY; // eslint-disable-line no-implicit-coercion

export const OUTPUT_DIRECTORY = path.resolve(SCRABBLE_SOLVER_DIRECTORY, 'dictionaries');
