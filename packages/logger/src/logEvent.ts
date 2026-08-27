import fs from 'fs';

import { EVENTS_FILEPATH, IS_TEST_RUN, OUTPUT_DIRECTORY } from './constants';
import { EVENT_FIELDS, type Event } from './events';

export function logEvent(event: Event): void {
  if (IS_TEST_RUN) {
    return;
  }

  try {
    fs.mkdirSync(OUTPUT_DIRECTORY, { recursive: true });
    fs.appendFileSync(EVENTS_FILEPATH, formatEventLine(event, new Date()));
  } catch (error) {
    process.stderr.write(`Could not append to ${EVENTS_FILEPATH}: ${String(error)}\n`);
  }
}

export function formatEventLine(event: Event, now: Date): string {
  const line = { timestamp: formatTimestamp(now), ...event };
  return `${JSON.stringify(line, ['timestamp', 'type', ...EVENT_FIELDS[event.type]])}\n`;
}

function formatTimestamp(date: Date): string {
  return `${date.toISOString().slice(0, 19)}Z`;
}
