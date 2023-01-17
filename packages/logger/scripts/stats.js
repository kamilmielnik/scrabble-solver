const fs = require('fs');
const os = require('os');
const path = require('path');
const { argv } = require('process');

const DAY = 24 * 60 * 60 * 1000;

const getStats = (event, lines, since) => {
  const daysCount = Math.ceil((Date.now() - Number(new Date(since))) / DAY);
  const days = {};

  let nextIndex = 0;
  while (nextIndex !== -1) {
    nextIndex = lines.indexOf(event, nextIndex + 1);

    if (nextIndex) {
      const timestampLine = lines[nextIndex + 1];
      const day = timestampLine.substr(`  timestamp: '`.length, 'YYYY-MM-DD'.length);
      days[day] = days[day] || 0;
      days[day]++;
    }
  }

  const filteredDays = Object.fromEntries(
    Object.entries(days).filter(([key]) => {
      return key.localeCompare(since) >= 0;
    }),
  );

  const sum = Object.entries(filteredDays).reduce((result, [, value]) => result + value, 0);

  return { daysCount, event, filteredDays, sum };
};

const printStats = ({ daysCount, event, filteredDays, sum }) => {
  console.log('--------------------------------------');
  console.log(event);
  console.log('--------------------------------------');
  console.log(`Sum: ${sum}`);
  console.log(`Avg: ${sum / daysCount}`);
  console.table(filteredDays);
};

const filepath = path.resolve(os.homedir(), '.scrabble-solver', 'logs', 'all.log');
const file = fs.readFileSync(filepath, 'utf-8');
const lines = file.split('\n');
const since = argv[2] || '2021-06-01';
const events = [`  message: 'visit - request',`, `  message: 'solve - request',`, `  message: 'dictionary - request',`];

for (const event of events) {
  printStats(getStats(event, lines, since));
}
