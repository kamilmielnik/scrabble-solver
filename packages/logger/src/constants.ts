import os from 'os';
import path from 'path';

export const OUTPUT_DIRECTORY = path.resolve(os.homedir(), '.scrabble-solver', 'logs');

export const EVENTS_FILEPATH = path.resolve(OUTPUT_DIRECTORY, 'events.txt');

export const CSV_DIRECTORY = path.resolve(os.homedir(), '.scrabble-solver', 'csv');
