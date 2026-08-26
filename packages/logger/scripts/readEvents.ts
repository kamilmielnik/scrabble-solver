import fs from 'node:fs';
import readline from 'node:readline';

import { EVENT_FIELDS, EVENTS_FILEPATH, type LoggedEvent } from '../src';

export async function* readEvents(): AsyncGenerator<LoggedEvent | undefined> {
  if (!fs.existsSync(EVENTS_FILEPATH)) {
    throw new Error(`No events file at ${EVENTS_FILEPATH}`);
  }

  const lines = readline.createInterface({ input: fs.createReadStream(EVENTS_FILEPATH), crlfDelay: Infinity });

  for await (const line of lines) {
    yield parseEvent(line);
  }
}

function parseEvent(line: string): LoggedEvent | undefined {
  try {
    const value: unknown = JSON.parse(line);
    return isLoggedEvent(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

function isLoggedEvent(value: unknown): value is LoggedEvent {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const { timestamp, type } = value as Partial<Record<'timestamp' | 'type', unknown>>;
  return typeof timestamp === 'string' && typeof type === 'string' && Object.hasOwn(EVENT_FIELDS, type);
}
