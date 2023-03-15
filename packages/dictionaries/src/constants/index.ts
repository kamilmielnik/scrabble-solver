import path from 'path';
import untildify from 'untildify';

const SCRABBLE_SOLVER_DIRECTORY = process.env.SCRABBLE_SOLVER_DIRECTORY
  ? untildify(process.env.SCRABBLE_SOLVER_DIRECTORY)
  : path.join(process.cwd(), '.scrabble-solver');

export const DICTIONARIES_DIRECTORY = path.resolve(SCRABBLE_SOLVER_DIRECTORY, 'dictionaries');

export const DAY = 24 * 60 * 60 * 1000;

export const CACHE_STALE_THRESHOLD = 1 * DAY; // eslint-disable-line no-implicit-coercion
