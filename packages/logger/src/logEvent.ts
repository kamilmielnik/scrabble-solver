import fs from 'fs';

import { EVENTS_FILEPATH, OUTPUT_DIRECTORY } from './constants';
import { EVENT_FIELDS, type Event, type EventValue } from './events';

const isTestRun = process.env.NODE_ENV === 'test';

export function logEvent(event: Event): void {
  if (isTestRun) {
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
  const values: Record<string, EventValue> = event;
  const fields = Object.fromEntries(EVENT_FIELDS[event.type].map((field) => [field, values[field]]));
  return `${JSON.stringify({ timestamp: formatTimestamp(now), type: event.type, ...fields })}\n`;
}

function formatTimestamp(date: Date): string {
  return `${date.toISOString().slice(0, 19)}Z`;
}
