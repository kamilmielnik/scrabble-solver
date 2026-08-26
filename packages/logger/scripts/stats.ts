import { type EventType } from '../src';

import { readEvents } from './readEvents';

type DailyCounts = Map<string, number>;

const DAY = 24 * 60 * 60 * 1000;
const DAY_FORMAT = /^\d{4}-\d{2}-\d{2}$/;

await printStats(parseSince(process.argv[2]));

async function printStats(since: string | undefined): Promise<void> {
  const counts = new Map<EventType, DailyCounts>();
  let firstDay: string | undefined;
  let skippedLines = 0;

  for await (const event of readEvents()) {
    if (!event) {
      skippedLines += 1;
      continue;
    }

    const day = event.timestamp.slice(0, 10);

    if (since && day < since) {
      continue;
    }

    firstDay = firstDay && firstDay < day ? firstDay : day;
    increment(counts, event.type, day);
  }

  const daysCount = getDaysCount(since ?? firstDay);

  for (const [type, days] of [...counts].sort(([a], [b]) => a.localeCompare(b))) {
    printTypeStats(type, days, daysCount);
  }

  if (skippedLines > 0) {
    console.log(`Skipped ${skippedLines} unparseable lines`);
  }
}

function increment(counts: Map<EventType, DailyCounts>, type: EventType, day: string): void {
  const days = counts.get(type) ?? new Map<string, number>();
  days.set(day, (days.get(day) ?? 0) + 1);
  counts.set(type, days);
}

function getDaysCount(since: string | undefined): number {
  if (!since) {
    return 1;
  }

  return Math.max(1, Math.ceil((Date.now() - Date.parse(since)) / DAY));
}

function printTypeStats(type: EventType, days: DailyCounts, daysCount: number): void {
  const sum = [...days.values()].reduce((result, count) => result + count, 0);
  console.log('--------------------------------------');
  console.log(type);
  console.log('--------------------------------------');
  console.log(`Sum: ${sum}`);
  console.log(`Avg: ${(sum / daysCount).toFixed(1)}`);
  console.table(Object.fromEntries(days));
}

function parseSince(argument: string | undefined): string | undefined {
  if (argument !== undefined && !DAY_FORMAT.test(argument)) {
    throw new Error(`Expected a YYYY-MM-DD day, got "${argument}"`);
  }

  return argument;
}
