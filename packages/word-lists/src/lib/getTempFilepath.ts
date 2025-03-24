import os from 'os';
import path from 'path';

import { getHash } from './getHash';

const OUTPUT_DIRECTORY = path.resolve(os.homedir(), '.scrabble-solver');

export const getTempFilepath = (): string => {
  const filename = `${getHash()}.txt`;
  return path.join(OUTPUT_DIRECTORY, filename);
};
