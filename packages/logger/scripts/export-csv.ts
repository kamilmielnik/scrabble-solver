import { once } from 'node:events';
import fs from 'node:fs';
import path from 'node:path';

import { CSV_DIRECTORY, EVENT_FIELDS, type EventType, type EventValue, formatCsvRow, type LoggedEvent } from '../src';

import { readEvents } from './readEvents';

interface CsvFile {
  filename: string;
  rows: number;
  stream: fs.WriteStream;
}

await exportCsv(process.argv[2]);

async function exportCsv(month: string | undefined): Promise<void> {
  fs.mkdirSync(CSV_DIRECTORY, { recursive: true });
  const files = new Map<string, CsvFile>();
  let skippedLines = 0;

  for await (const event of readEvents()) {
    if (!event) {
      skippedLines += 1;
      continue;
    }

    const eventMonth = event.timestamp.slice(0, 7);

    if (month && eventMonth !== month) {
      continue;
    }

    await writeRow(getFile(files, event.type, eventMonth), formatEventRow(event));
  }

  await Promise.all([...files.values()].map(closeFile));
  printSummary(files, skippedLines);
}

function formatEventRow(event: LoggedEvent): string {
  const values: Record<string, EventValue> = event;
  return formatCsvRow([event.timestamp, ...EVENT_FIELDS[event.type].map((field) => values[field])]);
}

function getFile(files: Map<string, CsvFile>, type: EventType, month: string): CsvFile {
  const filename = `${type}s-${month}.csv`;
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
  stream.write(formatCsvRow(['timestamp', ...EVENT_FIELDS[type]]));
  return { filename, rows: 0, stream };
}

async function writeRow(file: CsvFile, row: string): Promise<void> {
  file.rows += 1;

  if (!file.stream.write(row)) {
    await once(file.stream, 'drain');
  }
}

async function closeFile(file: CsvFile): Promise<void> {
  file.stream.end();
  await once(file.stream, 'finish');
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
