import fs from 'fs';

import { EVENTS_FILEPATH, IS_TEST_RUN, OUTPUT_DIRECTORY } from './constants';
import { type Event, EVENT_FIELDS } from './events';
import { formatTimestamp } from './timestamp';

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
