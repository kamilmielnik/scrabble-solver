import { mock, spyOn } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import type * as loggerModule from '../../src/index';

export interface ExportOutcome {
  failure: string | undefined;
  output: string[];
}

export type RunExport = (...args: string[]) => Promise<ExportOutcome>;

export interface ExportHarness {
  childEnv: Record<string, string>;
  csvDirectory: string;
  eventsFilepath: string;
  homeDirectory: string;
  cleanUp: () => void;
  getCsvPath: (filename: string) => string;
  listCsvFiles: () => string[];
  readCsv: (filename: string) => string;
  reset: () => void;
  runInChildProcess: RunExport;
  runners: [string, RunExport][];
  writeEvents: (lines: (Record<string, unknown> | string)[]) => void;
}

const EXPORT_SCRIPT = path.join(import.meta.dir, '..', 'export-csv.ts');

/**
 * Sends export-csv.ts to a temporary home, which stands in for $HOME/.scrabble-solver. The script does its work when
 * imported, so it can run in two ways. A child process proves the real entry point: argv, HOME, the exit code and
 * uncaught failures. A run inside the test process is the only one that reaches the coverage report.
 */
export async function createExportHarness(): Promise<ExportHarness> {
  const homeDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'logger-export-csv-'));
  const dataDirectory = path.join(homeDirectory, '.scrabble-solver');
  const outputDirectory = path.join(dataDirectory, 'logs');
  const eventsFilepath = path.join(outputDirectory, 'events.txt');
  const csvDirectory = path.join(dataDirectory, 'csv');
  const childEnv = { HOME: homeDirectory, NODE_ENV: 'production' };

  async function redirectConstants(): Promise<void> {
    await mock.module('../../src/constants', () => ({
      CSV_DIRECTORY: csvDirectory,
      EVENTS_FILEPATH: eventsFilepath,
      IS_TEST_RUN: true,
      OUTPUT_DIRECTORY: outputDirectory,
    }));
    await assertRedirected(eventsFilepath, csvDirectory);
  }

  async function runInTestProcess(...args: string[]): Promise<ExportOutcome> {
    await redirectConstants();
    return importExportScript(args);
  }

  await redirectConstants();

  function runInChildProcess(...args: string[]): Promise<ExportOutcome> {
    const options = { cwd: homeDirectory, encoding: 'utf8', env: childEnv } as const;
    const { status, stderr, stdout } = spawnSync(process.execPath, [EXPORT_SCRIPT, ...args], options);
    return Promise.resolve({ failure: status === 0 ? undefined : stderr, output: stdout.split('\n').filter(Boolean) });
  }

  return {
    childEnv,
    csvDirectory,
    eventsFilepath,
    homeDirectory,
    cleanUp: () => {
      fs.rmSync(homeDirectory, { force: true, recursive: true });
    },
    getCsvPath: (filename) => path.join(csvDirectory, filename),
    listCsvFiles: () => (fs.existsSync(csvDirectory) ? fs.readdirSync(csvDirectory).sort() : []),
    readCsv: (filename) => fs.readFileSync(path.join(csvDirectory, filename), 'utf8'),
    reset: () => {
      fs.rmSync(dataDirectory, { force: true, recursive: true });
    },
    runInChildProcess,
    runners: [
      ['a child process', runInChildProcess],
      ['the test process', runInTestProcess],
    ],
    writeEvents: (lines) => {
      fs.mkdirSync(outputDirectory, { recursive: true });
      fs.writeFileSync(eventsFilepath, lines.map(formatLine).join(''));
    },
  };
}

async function assertRedirected(eventsFilepath: string, csvDirectory: string): Promise<void> {
  const logger: typeof loggerModule = await import('../../src/index');

  if (logger.EVENTS_FILEPATH !== eventsFilepath || logger.CSV_DIRECTORY !== csvDirectory) {
    throw new Error(`The export would run against ${logger.EVENTS_FILEPATH} and ${logger.CSV_DIRECTORY}`);
  }
}

async function importExportScript(args: string[]): Promise<ExportOutcome> {
  const { argv } = process;
  const log = spyOn(console, 'log').mockImplementation(() => undefined);
  process.argv = [process.execPath, EXPORT_SCRIPT, ...args];

  try {
    await import(`../export-csv.ts?run=${randomUUID()}`);
    return { failure: undefined, output: log.mock.calls.map(([line]) => String(line)) };
  } catch (error) {
    return { failure: String(error), output: log.mock.calls.map(([line]) => String(line)) };
  } finally {
    process.argv = argv;
    log.mockRestore();
  }
}

function formatLine(line: Record<string, unknown> | string): string {
  return `${typeof line === 'string' ? line : JSON.stringify(line)}\n`;
}
