import os from 'os';
import path from 'path';

import getHash from './getHash';

const ROOT_DIRECTORY = process.env.CI ? process.cwd() : os.homedir();

const OUTPUT_DIRECTORY = path.resolve(ROOT_DIRECTORY, '.scrabble-solver');

const getTempFilepath = (): string => {
  const filename = `${getHash()}.txt`;
  return path.join(OUTPUT_DIRECTORY, filename);
};

export default getTempFilepath;
