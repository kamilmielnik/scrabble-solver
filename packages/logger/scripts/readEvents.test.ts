import { afterAll, afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { type LoggedEvent, EVENT_FIELDS } from '../src/events';
import type * as loggerModule from '../src/index';

import type * as readEventsModule from './readEvents';

const TEST_DIRECTORY = fs.mkdtempSync(path.join(os.tmpdir(), 'logger-read-events-'));
const EVENTS_FILEPATH = path.join(TEST_DIRECTORY, 'events.txt');
const VISIT = { timestamp: '2026-08-23T02:09:02Z', type: 'visit', ip: '::1' };
const SOLVE = { timestamp: '2026-08-23T02:09:03Z', type: 'solve', ms: 14 };
const VISIT_LINE = JSON.stringify(VISIT);
const SOLVE_LINE = JSON.stringify(SOLVE);

await mockConstants();

const { readEvents }: typeof readEventsModule = await import('./readEvents');

describe('readEvents', () => {
  beforeEach(async () => {
    await mockConstants();
    const logger: typeof loggerModule = await import('../src/index');

    expect(logger.EVENTS_FILEPATH).toBe(EVENTS_FILEPATH);
  });

  afterEach(() => {
    fs.rmSync(EVENTS_FILEPATH, { force: true });
  });

  afterAll(() => {
    fs.rmSync(TEST_DIRECTORY, { force: true, recursive: true });
  });

  it('fails with the path of a missing file', async () => {
    const failure: unknown = await readAll().catch((error: unknown) => error);

    expect(failure).toEqual(new Error(`No events file at ${EVENTS_FILEPATH}`));
  });

  it('yields nothing for an empty file', async () => {
    fs.writeFileSync(EVENTS_FILEPATH, '');

    expect(await readAll()).toEqual([]);
  });

  it('yields events in file order', async () => {
    fs.writeFileSync(EVENTS_FILEPATH, `${SOLVE_LINE}\n${VISIT_LINE}\n`);

    expect(await readAll()).toEqual([SOLVE, VISIT] as LoggedEvent[]);
  });

  it('reads a last line that has no line break', async () => {
    fs.writeFileSync(EVENTS_FILEPATH, `${VISIT_LINE}\n${SOLVE_LINE}`);

    expect(await readAll()).toEqual([VISIT, SOLVE] as LoggedEvent[]);
  });

  it('reads lines that end with CRLF', async () => {
    fs.writeFileSync(EVENTS_FILEPATH, `${VISIT_LINE}\r\n${SOLVE_LINE}\r\n`);

    expect(await readAll()).toEqual([VISIT, SOLVE] as LoggedEvent[]);
  });

  it('reads a file that mixes CRLF and LF', async () => {
    fs.writeFileSync(EVENTS_FILEPATH, `${VISIT_LINE}\r\n${SOLVE_LINE}\n${VISIT_LINE}\r\n`);

    expect(await readAll()).toEqual([VISIT, SOLVE, VISIT] as LoggedEvent[]);
  });

  it('accepts every declared event type', async () => {
    const types = Object.keys(EVENT_FIELDS);
    const lines = types.map((type) => JSON.stringify({ timestamp: VISIT.timestamp, type }));
    fs.writeFileSync(EVENTS_FILEPATH, `${lines.join('\n')}\n`);

    const events = await readAll();

    expect(events.map((event) => event?.type)).toEqual(types as LoggedEvent['type'][]);
  });

  it('keeps an old line that lacks fields declared later', async () => {
    const line = { timestamp: '2025-01-01T00:00:00Z', type: 'solve', ip: '::1', ms: 3 };
    fs.writeFileSync(EVENTS_FILEPATH, `${JSON.stringify(line)}\n`);

    expect(await readAll()).toEqual([line] as LoggedEvent[]);
  });

  it('keeps a stack with line breaks as a single event', async () => {
    const line = { timestamp: VISIT.timestamp, type: 'error', stack: 'Error: boom\n    at solve' };
    fs.writeFileSync(EVENTS_FILEPATH, `${JSON.stringify(line)}\n`);

    expect(await readAll()).toEqual([line] as LoggedEvent[]);
  });

  it('decodes non-ASCII text split across read chunks', async () => {
    const line = { timestamp: VISIT.timestamp, type: 'solve', rack: 'ż'.repeat(100_000) };
    fs.writeFileSync(EVENTS_FILEPATH, `${JSON.stringify(line)}\n`);

    expect(await readAll()).toEqual([line] as LoggedEvent[]);
  });

  it.each([
    ['a blank line', ''],
    ['a line of whitespace', '   '],
    ['invalid JSON', 'not json'],
    ['a line cut off mid-write', '{"timestamp":"2026-08-23T02:09:02Z","type":"vis'],
    ['JSON null', 'null'],
    ['a JSON number', '42'],
    ['a JSON string', '"visit"'],
    ['a JSON boolean', 'true'],
    ['a JSON array', '[]'],
    ['an empty object', '{}'],
    ['a missing timestamp', '{"type":"visit"}'],
    ['a missing type', '{"timestamp":"2026-08-23T02:09:02Z"}'],
    ['a timestamp that is not a string', '{"timestamp":20260823,"type":"visit"}'],
    ['a type that is not a string', '{"timestamp":"2026-08-23T02:09:02Z","type":1}'],
    ['an unknown type', '{"timestamp":"2026-08-23T02:09:02Z","type":"unknown"}'],
    ['a type named like an inherited property', '{"timestamp":"2026-08-23T02:09:02Z","type":"constructor"}'],
    ['the winston format of old logs', '{ level: "info", message: "visit" }'],
  ])('marks %s as unparseable and carries on', async (_name, line) => {
    fs.writeFileSync(EVENTS_FILEPATH, `${VISIT_LINE}\n${line}\n${SOLVE_LINE}\n`);

    expect(await readAll()).toEqual([VISIT, undefined, SOLVE] as LoggedEvent[]);
  });

  it.each([
    ['holds a path separator', 'a/bc'],
    ['is not a date', 'oops'],
    ['lacks the time', '2026-08-23'],
  ])('marks a line whose timestamp %s as unparseable', async (_name, timestamp) => {
    fs.writeFileSync(EVENTS_FILEPATH, `{"timestamp":"${timestamp}","type":"visit"}\n${SOLVE_LINE}\n`);

    expect(await readAll()).toEqual([undefined, SOLVE] as LoggedEvent[]);
  });
});

async function mockConstants(): Promise<void> {
  await mock.module('../src/constants', () => ({
    CSV_DIRECTORY: path.join(TEST_DIRECTORY, 'csv'),
    EVENTS_FILEPATH,
    IS_TEST_RUN: true,
    OUTPUT_DIRECTORY: TEST_DIRECTORY,
  }));
}

async function readAll(): Promise<(LoggedEvent | undefined)[]> {
  const events: (LoggedEvent | undefined)[] = [];

  for await (const event of readEvents()) {
    events.push(event);
  }

  return events;
}
