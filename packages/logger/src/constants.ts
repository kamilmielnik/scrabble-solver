import path from 'path';
import untildify from 'untildify';

const SCRABBLE_SOLVER_DIRECTORY = process.env.SCRABBLE_SOLVER_DIRECTORY
  ? untildify(process.env.SCRABBLE_SOLVER_DIRECTORY)
  : path.join(process.cwd(), '.scrabble-solver');

export const LOGS_DIRECTORY = path.resolve(SCRABBLE_SOLVER_DIRECTORY, 'logs');
