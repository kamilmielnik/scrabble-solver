import os from 'os';
import path from 'path';

import getHash from './getHash';

const DEFAULT_SCRABBLE_SOLVER_DIRECTORY = path.resolve(os.homedir(), '.scrabble-solver');
const SCRABBLE_SOLVER_DIRECTORY = process.env.SCRABBLE_SOLVER_DIRECTORY || DEFAULT_SCRABBLE_SOLVER_DIRECTORY;

const getTempFilepath = (): string => {
  const filename = `${getHash()}.txt`;
  return path.resolve(SCRABBLE_SOLVER_DIRECTORY, filename);
};

export default getTempFilepath;
