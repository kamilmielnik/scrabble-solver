import os from 'os';
import path from 'path';

// bun test exposes the Jest globals to every module, so their presence marks a test run even under an inherited NODE_ENV
declare const describe: unknown;

export const OUTPUT_DIRECTORY = path.resolve(os.homedir(), '.scrabble-solver', 'logs');

export const EVENTS_FILEPATH = path.resolve(OUTPUT_DIRECTORY, 'events.txt');

export const CSV_DIRECTORY = path.resolve(os.homedir(), '.scrabble-solver', 'csv');

export const IS_TEST_RUN = process.env.NODE_ENV === 'test' || typeof describe === 'function';
