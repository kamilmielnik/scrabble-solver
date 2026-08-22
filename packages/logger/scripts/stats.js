const fs = require('fs');
const os = require('os');
const path = require('path');
const { argv } = require('process');

const DAY = 24 * 60 * 60 * 1000;
const EVENTS = [`  message: 'visit - request',`, `  message: 'solve - request',`, `  message: 'dictionary - request',`];
const TIMESTAMP_PREFIX = `  timestamp: '`;
const DATE_LENGTH = 'YYYY-MM-DD'.length;

main();

async function main() {
  const filepath = path.resolve(os.homedir(), 'desktop', 'all.log');
  const since = argv[2] || '2021-06-01';
  const countsPerDay = await countEventsPerDay(filepath, since);

  for (const event of EVENTS) {
    printStats(getStats(event, countsPerDay.get(event), since));
  }
}

async function countEventsPerDay(filepath, since) {
  const countsPerDay = new Map(EVENTS.map((event) => [event, {}]));
  let pendingEvent;

  for await (const line of readLines(filepath)) {
    if (pendingEvent) {
      const day = line.slice(TIMESTAMP_PREFIX.length, TIMESTAMP_PREFIX.length + DATE_LENGTH);

      if (day >= since) {
        const counts = countsPerDay.get(pendingEvent);
        counts[day] = (counts[day] || 0) + 1;
      }

      pendingEvent = undefined;
    } else if (countsPerDay.has(line)) {
      pendingEvent = line;
    }
  }

  return countsPerDay;
}

async function* readLines(filepath) {
  let remainder = '';

  for await (const chunk of fs.createReadStream(filepath, 'utf-8')) {
    const lines = (remainder + chunk).split('\n');
    remainder = lines.pop();
    yield* lines;
  }

  if (remainder) {
    yield remainder;
  }
}

function getStats(event, countsPerDay, since) {
  const daysCount = Math.ceil((Date.now() - Number(new Date(since))) / DAY);
  const sum = Object.values(countsPerDay).reduce((result, count) => result + count, 0);

  return { daysCount, event, countsPerDay, sum };
}

function printStats({ daysCount, event, countsPerDay, sum }) {
  console.log('--------------------------------------');
  console.log(event);
  console.log('--------------------------------------');
  console.log(`Sum: ${sum}`);
  console.log(`Avg: ${sum / daysCount}`);
  console.table(countsPerDay);
}
