import { afterAll, afterEach, describe, expect, it } from 'bun:test';
import fs from 'node:fs';

import { createExportHarness } from './test/createExportHarness';

const TIMESTAMP_2025 = '2025-12-31T23:59:59Z';
const TIMESTAMP_2026 = '2026-01-01T00:00:00Z';

const { cleanUp, csvDirectory, eventsFilepath, getCsvPath, listCsvFiles, readCsv, reset, runners, writeEvents } =
  await createExportHarness();

afterEach(reset);
afterAll(cleanUp);

describe.each(runners)('export-csv outcomes in %s', (_name, runExport) => {
  describe('year argument', () => {
    it('exports only the given year', async () => {
      writeEvents([
        { timestamp: TIMESTAMP_2025, type: 'visit', ip: 'a' },
        { timestamp: TIMESTAMP_2026, type: 'visit', ip: 'b' },
        { timestamp: TIMESTAMP_2025, type: 'build' },
      ]);

      const { output } = await runExport('2026');

      expect(listCsvFiles()).toEqual(['visit-2026.csv']);
      expect(readCsv('visit-2026.csv')).toContain(`${TIMESTAMP_2026},b,`);
      expect(output).toEqual([`${getCsvPath('visit-2026.csv')}: 1 rows`]);
    });

    it('leaves the files of other years in place', async () => {
      writeEvents([
        { timestamp: TIMESTAMP_2025, type: 'visit' },
        { timestamp: TIMESTAMP_2026, type: 'visit' },
      ]);
      await runExport('2025');

      await runExport('2026');

      expect(listCsvFiles()).toEqual(['visit-2025.csv', 'visit-2026.csv']);
    });

    it('reports no events when none fall in the given year', async () => {
      writeEvents([{ timestamp: TIMESTAMP_2026, type: 'visit' }]);

      const { failure, output } = await runExport('1999');

      expect(failure).toBeUndefined();
      expect(output).toEqual(['No events to export']);
      expect(listCsvFiles()).toEqual([]);
    });

    it.each([['26'], ['20261'], ['2o26'], ['2026-01'], [' 2026'], ['']])('rejects the year "%s"', async (year) => {
      writeEvents([{ timestamp: TIMESTAMP_2026, type: 'visit' }]);

      const { failure, output } = await runExport(year);

      expect(failure).toContain(`Expected a YYYY year, got "${year}"`);
      expect(output).toEqual([]);
      expect(listCsvFiles()).toEqual([]);
    });
  });

  describe('summary', () => {
    it('lists the files in alphabetical order with their row counts', async () => {
      writeEvents([
        { timestamp: TIMESTAMP_2026, type: 'visit' },
        { timestamp: TIMESTAMP_2026, type: 'visit' },
        { timestamp: TIMESTAMP_2026, type: 'build' },
        { timestamp: TIMESTAMP_2025, type: 'visit' },
      ]);

      const { output } = await runExport();

      expect(output).toEqual([
        `${getCsvPath('build-2026.csv')}: 1 rows`,
        `${getCsvPath('visit-2025.csv')}: 1 rows`,
        `${getCsvPath('visit-2026.csv')}: 2 rows`,
      ]);
    });

    it('reports no events for an empty log', async () => {
      writeEvents([]);

      const { failure, output } = await runExport();

      expect(failure).toBeUndefined();
      expect(output).toEqual(['No events to export']);
      expect(listCsvFiles()).toEqual([]);
    });

    it('counts unparseable lines and exports the rest', async () => {
      writeEvents([
        'not json',
        { timestamp: TIMESTAMP_2026, type: 'visit', ip: 'a' },
        '',
        '{"timestamp":"2026-01-01T00:00:00Z","type":"unknown"}',
      ]);

      const { output } = await runExport();

      expect(readCsv('visit-2026.csv')).toBe(`timestamp,ip,ua,referrer,locale,game,url\n${TIMESTAMP_2026},a,,,,,\n`);
      expect(output).toEqual([`${getCsvPath('visit-2026.csv')}: 1 rows`, 'Skipped 3 unparseable lines']);
    });

    it('reports no events alongside the skipped lines when nothing could be parsed', async () => {
      writeEvents(['not json', 'null']);

      const { failure, output } = await runExport();

      expect(failure).toBeUndefined();
      expect(output).toEqual(['No events to export', 'Skipped 2 unparseable lines']);
    });

    it('counts unparseable lines even when exporting one year, as they have no year', async () => {
      writeEvents([{ timestamp: TIMESTAMP_2025, type: 'visit' }, 'not json']);

      const { output } = await runExport('2026');

      expect(output).toEqual(['No events to export', 'Skipped 1 unparseable lines']);
    });
  });

  describe('failures', () => {
    it('fails with the path of a missing log', async () => {
      const { failure, output } = await runExport();

      expect(failure).toContain(`No events file at ${eventsFilepath}`);
      expect(output).toEqual([]);
    });

    it('fails when the CSV directory cannot be created', async () => {
      writeEvents([{ timestamp: TIMESTAMP_2026, type: 'visit' }]);
      fs.writeFileSync(csvDirectory, 'a file where the directory should be');

      const { failure, output } = await runExport();

      expect(failure).toBeDefined();
      expect(output).toEqual([]);
      expect(fs.readFileSync(csvDirectory, 'utf8')).toBe('a file where the directory should be');
    });

    it('fails when the file turns out not to open while the export closes it', async () => {
      writeEvents([{ timestamp: TIMESTAMP_2026, type: 'visit' }]);
      fs.mkdirSync(getCsvPath('visit-2026.csv'), { recursive: true });

      const { failure, output } = await runExport();

      expect(failure).toContain('EISDIR');
      expect(output).toEqual([]);
    });

    it('fails when the file turns out not to open after the last row', async () => {
      writeEvents([{ timestamp: TIMESTAMP_2026, type: 'visit' }, 'x'.repeat(70_000)]);
      fs.mkdirSync(getCsvPath('visit-2026.csv'), { recursive: true });

      const { failure, output } = await runExport();

      expect(failure).toContain('EISDIR');
      expect(output).toEqual([]);
    });

    it('fails when the file turns out not to open while the export waits for it to drain', async () => {
      writeEvents(Array.from({ length: 5000 }, () => ({ timestamp: TIMESTAMP_2026, type: 'visit' })));
      fs.mkdirSync(getCsvPath('visit-2026.csv'), { recursive: true });

      const { failure, output } = await runExport();

      expect(failure).toContain('EISDIR');
      expect(output).toEqual([]);
    });

    it('fails when the file turns out not to open between two rows', async () => {
      const padding = 'x'.repeat(70_000);
      writeEvents(Array.from({ length: 3 }, () => ({ timestamp: TIMESTAMP_2026, type: 'visit', padding })));
      fs.mkdirSync(getCsvPath('visit-2026.csv'), { recursive: true });

      const { failure, output } = await runExport();

      expect(failure).toContain('EISDIR');
      expect(output).toEqual([]);
    });
  });
});
