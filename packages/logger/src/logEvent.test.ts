import {
  type Mock,
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  setSystemTime,
  spyOn,
} from 'bun:test';
import fs from 'fs';
import os from 'os';
import path from 'path';

import type * as constantsModule from './constants';
import { type Event } from './events';
import type * as logEventModule from './logEvent';

const NOW = new Date('2026-08-23T02:09:02.123Z');
const BUILD_EVENT: Event = { type: 'build', locale: 'pl-PL', words: 3, download_ms: 1, build_ms: 2 };
const BUILD_LINE =
  '{"timestamp":"2026-08-23T02:09:02Z","type":"build","locale":"pl-PL","words":3,"download_ms":1,"build_ms":2}\n';

const TEST_DIRECTORY = fs.mkdtempSync(path.join(os.tmpdir(), 'logger-log-event-'));
const OUTPUT_DIRECTORY = path.join(TEST_DIRECTORY, 'nested', 'logs');
const EVENTS_FILEPATH = path.join(OUTPUT_DIRECTORY, 'events.txt');

await mockConstants({ isTestRun: true });

const { logEvent }: typeof logEventModule = await import('./logEvent');

describe('logEvent', () => {
  let stderrWrite: Mock<typeof process.stderr.write>;

  beforeAll(async () => {
    const constants: typeof constantsModule = await import('./constants');

    expect(constants.EVENTS_FILEPATH).toBe(EVENTS_FILEPATH);
    expect(constants.OUTPUT_DIRECTORY).toBe(OUTPUT_DIRECTORY);
  });

  beforeEach(async () => {
    await mockConstants({ isTestRun: false });
    setSystemTime(NOW);
    stderrWrite = spyOn(process.stderr, 'write').mockImplementation(() => true);
  });

  afterEach(async () => {
    await mockConstants({ isTestRun: true });
    stderrWrite.mockRestore();
    setSystemTime();
    fs.rmSync(path.dirname(OUTPUT_DIRECTORY), { force: true, recursive: true });
  });

  afterAll(() => {
    fs.rmSync(TEST_DIRECTORY, { force: true, recursive: true });
  });

  it('creates the missing log directory and writes the event', () => {
    expect(fs.existsSync(path.dirname(OUTPUT_DIRECTORY))).toBe(false);

    logEvent(BUILD_EVENT);

    expect(fs.readFileSync(EVENTS_FILEPATH, 'utf8')).toBe(BUILD_LINE);
    expect(getStderr()).toBe('');
  });

  it('stamps each event with the time it was logged', () => {
    setSystemTime(new Date('2030-01-02T03:04:05.678Z'));

    logEvent({ type: 'visit' });

    expect(fs.readFileSync(EVENTS_FILEPATH, 'utf8')).toBe('{"timestamp":"2030-01-02T03:04:05Z","type":"visit"}\n');
  });

  it('appends one line per event, in the order they were logged', () => {
    logEvent({ type: 'visit', ip: '1' });
    logEvent({ type: 'visit', ip: '2' });
    logEvent({ type: 'visit', ip: '3' });

    expect(readEvents()).toEqual([
      { timestamp: '2026-08-23T02:09:02Z', type: 'visit', ip: '1' },
      { timestamp: '2026-08-23T02:09:02Z', type: 'visit', ip: '2' },
      { timestamp: '2026-08-23T02:09:02Z', type: 'visit', ip: '3' },
    ]);
  });

  it('keeps the lines already in the file', () => {
    fs.mkdirSync(OUTPUT_DIRECTORY, { recursive: true });
    fs.writeFileSync(EVENTS_FILEPATH, 'existing line\n');

    logEvent(BUILD_EVENT);

    expect(fs.readFileSync(EVENTS_FILEPATH, 'utf8')).toBe(`existing line\n${BUILD_LINE}`);
  });

  it('writes one line for an event with a multi-line stack', () => {
    logEvent({ type: 'error', level: 'error', operation: 'solve', message: 'boom', stack: 'one\n    at two\n' });
    logEvent({ type: 'visit' });

    expect(readEvents().map(({ type }) => type)).toEqual(['error', 'visit']);
  });

  it('reports a failed append on stderr instead of throwing', () => {
    fs.mkdirSync(EVENTS_FILEPATH, { recursive: true });

    expect(() => {
      logEvent(BUILD_EVENT);
    }).not.toThrow();

    expect(stderrWrite).toHaveBeenCalledTimes(1);
    expect(getStderr()).toStartWith(`Could not append to ${EVENTS_FILEPATH}: `);
    expect(getStderr()).toContain('EISDIR');
    expect(getStderr()).toEndWith('\n');
  });

  it('reports a log directory it could not create on stderr instead of throwing', () => {
    fs.mkdirSync(path.dirname(OUTPUT_DIRECTORY), { recursive: true });
    fs.writeFileSync(OUTPUT_DIRECTORY, 'a file where the directory should be');

    expect(() => {
      logEvent(BUILD_EVENT);
    }).not.toThrow();

    expect(getStderr()).toStartWith(`Could not append to ${EVENTS_FILEPATH}: `);
    expect(fs.readFileSync(OUTPUT_DIRECTORY, 'utf8')).toBe('a file where the directory should be');
  });

  it('reports an event of an undeclared type on stderr instead of throwing', () => {
    expect(() => {
      logEvent({ type: 'unknown' } as unknown as Event);
    }).not.toThrow();

    expect(getStderr()).toStartWith(`Could not append to ${EVENTS_FILEPATH}: `);
    expect(fs.existsSync(EVENTS_FILEPATH)).toBe(false);
  });

  it('writes nothing in a test run', async () => {
    await mockConstants({ isTestRun: true });

    logEvent(BUILD_EVENT);

    expect(fs.existsSync(path.dirname(OUTPUT_DIRECTORY))).toBe(false);
    expect(stderrWrite).not.toHaveBeenCalled();
  });

  function getStderr(): string {
    return stderrWrite.mock.calls.map(([text]) => String(text)).join('');
  }
});

function readEvents(): Record<string, unknown>[] {
  const lines = fs.readFileSync(EVENTS_FILEPATH, 'utf8').trimEnd().split('\n');
  return lines.map((line) => JSON.parse(line) as Record<string, unknown>);
}

async function mockConstants({ isTestRun }: { isTestRun: boolean }): Promise<void> {
  await mock.module('./constants', () => ({
    CSV_DIRECTORY: path.join(TEST_DIRECTORY, 'csv'),
    EVENTS_FILEPATH,
    IS_TEST_RUN: isTestRun,
    OUTPUT_DIRECTORY,
  }));
}
