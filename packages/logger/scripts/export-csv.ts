import { once } from 'node:events';
import fs from 'node:fs';
import path from 'node:path';

import { CSV_DIRECTORY, EVENT_FIELDS, type EventType, type EventValue, formatCsvRow, type LoggedEvent } from '../src';

import { readEvents } from './readEvents';

interface CsvFile {
  error: Error | undefined;
  filename: string;
  rows: number;
  stream: fs.WriteStream;
}

const YEAR_FORMAT = /^\d{4}$/;

await exportCsv(parseYear(process.argv[2]));

async function exportCsv(year: string | undefined): Promise<void> {
  fs.mkdirSync(CSV_DIRECTORY, { recursive: true });
  const files = new Map<string, CsvFile>();
  let skippedLines = 0;

  for await (const event of readEvents()) {
    if (!event) {
      skippedLines += 1;
      continue;
    }

    const eventYear = event.timestamp.slice(0, 4);

    if (year && eventYear !== year) {
      continue;
    }

    await writeRow(getFile(files, event.type, eventYear), formatEventRow(event));
  }

  await Promise.all([...files.values()].map(closeFile));
  printSummary(files, skippedLines);
}

function formatEventRow(event: LoggedEvent): string {
  const values: Record<string, EventValue> = event;
  return formatCsvRow([event.timestamp, ...EVENT_FIELDS[event.type].map((field) => values[field])]);
}

function getFile(files: Map<string, CsvFile>, type: EventType, year: string): CsvFile {
  const filename = `${type}-${year}.csv`;
  const openedFile = files.get(filename);

  if (openedFile) {
    return openedFile;
  }

  const file = openFile(filename, type);
  files.set(filename, file);
  return file;
}

function openFile(filename: string, type: EventType): CsvFile {
  const stream = fs.createWriteStream(path.join(CSV_DIRECTORY, filename));
  const file: CsvFile = { error: undefined, filename, rows: 0, stream };
  stream.on('error', (error) => {
    file.error = error;
  });
  stream.write(formatCsvRow(['timestamp', ...EVENT_FIELDS[type]]));
  return file;
}

async function writeRow(file: CsvFile, row: string): Promise<void> {
  assertWritable(file);
  file.rows += 1;

  if (!file.stream.write(row)) {
    await once(file.stream, 'drain');
  }
}

async function closeFile(file: CsvFile): Promise<void> {
  assertWritable(file);
  file.stream.end();
  await once(file.stream, 'finish');
}

function assertWritable(file: CsvFile): void {
  if (file.error) {
    throw file.error;
  }
}

function printSummary(files: Map<string, CsvFile>, skippedLines: number): void {
  if (files.size === 0) {
    console.log('No events to export');
  }

  for (const file of [...files.values()].sort((a, b) => a.filename.localeCompare(b.filename))) {
    console.log(`${path.join(CSV_DIRECTORY, file.filename)}: ${file.rows} rows`);
  }

  if (skippedLines > 0) {
    console.log(`Skipped ${skippedLines} unparseable lines`);
  }
}

function parseYear(argument: string | undefined): string | undefined {
  if (argument !== undefined && !YEAR_FORMAT.test(argument)) {
    throw new Error(`Expected a YYYY year, got "${argument}"`);
  }

  return argument;
}
