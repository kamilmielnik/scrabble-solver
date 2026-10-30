import { afterAll, afterEach, describe, expect, it } from 'bun:test';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

import { type EventType, EVENT_FIELDS } from '../src/events';

import { createExportHarness } from './test/createExportHarness';

const TIMESTAMP_2025 = '2025-12-31T23:59:59Z';
const TIMESTAMP_2026 = '2026-01-01T00:00:00Z';
const LOGGER_MODULE = path.join(import.meta.dir, '..', 'src', 'index.ts');

/**
 * The header and the row of each event type. The fields of each event are in reverse order, so the columns can only
 * come from the schema. Metabase reads these columns by position, which makes them append-only.
 */
const EVERY_EVENT_TYPE: [EventType, Record<string, unknown>, string, string][] = [
  [
    'visit',
    { url: 'u', game: 'g', locale: 'l', referrer: 'r', ua: 'a', ip: 'i' },
    'timestamp,ip,ua,referrer,locale,game,url',
    `${TIMESTAMP_2026},i,a,r,l,g,u`,
  ],
  [
    'solve',
    { results: 8, rack: 'r', blanks: 4, tiles: 3, game: 'g', locale: 'l', ms: 2, ip: 'i' },
    'timestamp,ip,ms,locale,game,tiles,blanks,rack,results',
    `${TIMESTAMP_2026},i,2,l,g,3,4,r,8`,
  ],
  [
    'verify',
    { invalid: 8, valid: 7, blanks: 4, tiles: 3, game: 'g', locale: 'l', ms: 2, ip: 'i' },
    'timestamp,ip,ms,locale,game,tiles,blanks,valid,invalid',
    `${TIMESTAMP_2026},i,2,l,g,3,4,7,8`,
  ],
  [
    'download',
    { bytes: 6, encoding: 'gzip', status: 304, locale: 'l', ms: 2, ip: 'i' },
    'timestamp,ip,ms,locale,status,encoding,bytes',
    `${TIMESTAMP_2026},i,2,l,304,gzip,6`,
  ],
  [
    'definition',
    { found: 5, words: 'w', locale: 'l', ms: 2, ip: 'i' },
    'timestamp,ip,ms,locale,words,found',
    `${TIMESTAMP_2026},i,2,l,w,5`,
  ],
  [
    'build',
    { build_ms: 4, download_ms: 3, words: 2, locale: 'l' },
    'timestamp,locale,words,download_ms,build_ms',
    `${TIMESTAMP_2026},l,2,3,4`,
  ],
  [
    'error',
    { input: 'n', stack: 's', message: 'm', ua: 'a', ip: 'i', locale: 'l', operation: 'solve', level: 'warn' },
    'timestamp,level,operation,locale,ip,ua,message,stack,input',
    `${TIMESTAMP_2026},warn,solve,l,i,a,m,s,n`,
  ],
];

const { childEnv, homeDirectory, getCsvPath, listCsvFiles, readCsv, reset, runners, writeEvents, ...harness } =
  await createExportHarness();

afterEach(reset);
afterAll(harness.cleanUp);

it('pins a row for every declared event type', () => {
  expect(EVERY_EVENT_TYPE.map(([type]) => type).sort()).toEqual(Object.keys(EVENT_FIELDS).sort() as EventType[]);
});

describe.each(runners)('export-csv files in %s', (_name, runExport) => {
  it.each(EVERY_EVENT_TYPE)('writes the columns of a %s event in schema order', async (type, fields, header, row) => {
    writeEvents([{ ...fields, type, timestamp: TIMESTAMP_2026 }]);

    const { failure } = await runExport();

    expect(failure).toBeUndefined();
    expect(readCsv(`${type}-2026.csv`)).toBe(`${header}\n${row}\n`);
  });

  it('writes one file per event type and year', async () => {
    writeEvents([
      { timestamp: TIMESTAMP_2025, type: 'visit', ip: 'a' },
      { timestamp: TIMESTAMP_2026, type: 'visit', ip: 'b' },
      { timestamp: TIMESTAMP_2026, type: 'build', locale: 'pl-PL' },
      { timestamp: TIMESTAMP_2026, type: 'visit', ip: 'c' },
    ]);

    await runExport();

    expect(listCsvFiles()).toEqual(['build-2026.csv', 'visit-2025.csv', 'visit-2026.csv']);
    expect(readCsv('visit-2025.csv')).toBe(`timestamp,ip,ua,referrer,locale,game,url\n${TIMESTAMP_2025},a,,,,,\n`);
    expect(readCsv('visit-2026.csv')).toBe(
      `timestamp,ip,ua,referrer,locale,game,url\n${TIMESTAMP_2026},b,,,,,\n${TIMESTAMP_2026},c,,,,,\n`,
    );
  });

  it('leaves the later columns of an old line empty, so the row keeps its width', async () => {
    writeEvents([{ timestamp: TIMESTAMP_2025, type: 'solve', ip: '::1', ms: 3, locale: 'en-US', game: 'scrabble' }]);

    await runExport();

    expect(readCsv('solve-2025.csv')).toBe(
      `timestamp,ip,ms,locale,game,tiles,blanks,rack,results\n${TIMESTAMP_2025},::1,3,en-US,scrabble,,,,\n`,
    );
  });

  it('ignores fields the schema does not declare', async () => {
    writeEvents([{ timestamp: TIMESTAMP_2026, type: 'build', locale: 'pl-PL', headers: 'secret' }]);

    await runExport();

    expect(readCsv('build-2026.csv')).not.toContain('secret');
  });

  it('escapes values, and counts a value with line breaks as one row', async () => {
    writeEvents([
      {
        timestamp: TIMESTAMP_2026,
        type: 'error',
        level: 'error',
        operation: 'solve',
        ua: 'Mozilla/5.0, "Safari"',
        message: '=cmd()',
        stack: 'Error: boom\n    at solve',
      },
    ]);

    const { output } = await runExport();

    expect(readCsv('error-2026.csv')).toBe(
      `timestamp,level,operation,locale,ip,ua,message,stack,input\n${TIMESTAMP_2026},error,solve,,,"Mozilla/5.0, ""Safari""",'=cmd(),"Error: boom\n    at solve",\n`,
    );
    expect(output).toEqual([`${getCsvPath('error-2026.csv')}: 1 rows`]);
  });

  it('replaces the file of an earlier export instead of appending to it', async () => {
    writeEvents([{ timestamp: TIMESTAMP_2026, type: 'build', locale: 'en-US' }]);
    await runExport();
    writeEvents([{ timestamp: TIMESTAMP_2026, type: 'build', locale: 'pl-PL' }]);

    await runExport();

    expect(readCsv('build-2026.csv')).toBe(`timestamp,locale,words,download_ms,build_ms\n${TIMESTAMP_2026},pl-PL,,,\n`);
  });

  it('writes every row of a log larger than the stream buffer, in order', async () => {
    const ips = Array.from({ length: 300 }, (_, index) => `${index}-${'x'.repeat(1024)}`);
    writeEvents(ips.map((ip) => ({ timestamp: TIMESTAMP_2026, type: 'visit', ip })));

    const { output } = await runExport();

    const rows = readCsv('visit-2026.csv').trimEnd().split('\n').slice(1);
    expect(rows).toEqual(ips.map((ip) => `${TIMESTAMP_2026},${ip},,,,,`));
    expect(output).toEqual([`${getCsvPath('visit-2026.csv')}: 300 rows`]);
  });
});

describe('export-csv after real logging', () => {
  it('exports what the logger wrote in a separate process', async () => {
    const script = `
      import { logError, logEvent } from ${JSON.stringify(LOGGER_MODULE)};

      logEvent({ type: 'build', locale: 'pl-PL', words: 3, download_ms: 1, build_ms: 2 });
      logError('solve', new Error('boom'), { locale: 'en-US' });
    `;
    const options = { cwd: homeDirectory, encoding: 'utf8', env: childEnv } as const;
    const { status, stderr } = spawnSync(process.execPath, ['-e', script], options);

    const { failure } = await harness.runInChildProcess();

    expect(status).toBe(0);
    expect(stderr).toStartWith('solve: Error: boom\n    at ');
    expect(failure).toBeUndefined();
    const [buildFile, errorFile] = listCsvFiles();
    expect(buildFile).toMatch(/^build-\d{4}\.csv$/);
    expect(errorFile).toMatch(/^error-\d{4}\.csv$/);
    expect(readCsv(buildFile)).toMatch(/^timestamp,locale,words,download_ms,build_ms\n[^,]+Z,pl-PL,3,1,2\n$/);
    expect(readCsv(errorFile)).toContain(',error,solve,en-US,,,Error: boom,');
  });
});
