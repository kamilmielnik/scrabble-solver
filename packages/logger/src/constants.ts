import os from 'os';
import path from 'path';

const ROOT_DIRECTORY = process.env.CI ? '/tmp' : os.homedir();

export const OUTPUT_DIRECTORY = path.resolve(ROOT_DIRECTORY, '.scrabble-solver', 'logs');
