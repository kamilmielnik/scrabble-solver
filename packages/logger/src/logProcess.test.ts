import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { type SpawnSyncReturns, spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

const LOGGER_MODULE = path.join(import.meta.dir, 'index.ts');

describe('logging in a real process', () => {
  let home: string;
  let eventsFilepath: string;

  beforeEach(() => {
    home = fs.mkdtempSync(path.join(os.tmpdir(), 'logger-process-'));
    eventsFilepath = path.join(home, '.scrabble-solver', 'logs', 'events.txt');
  });

  afterEach(() => {
    fs.rmSync(home, { force: true, recursive: true });
  });

  it('creates the log directory under HOME and appends one line per event', () => {
    const { status } = runLogger(`
      logEvent({ type: 'visit', ip: 'first' });
      logEvent({ type: 'visit', ip: 'second' });
    `);

    expect(status).toBe(0);
    expect(readEvents().map(({ ip }) => ip)).toEqual(['first', 'second']);
  });

  it('keeps the lines an earlier process wrote', () => {
    runLogger(`logEvent({ type: 'visit', ip: 'first' });`);
    runLogger(`logEvent({ type: 'visit', ip: 'second' });`);

    expect(readEvents().map(({ ip }) => ip)).toEqual(['first', 'second']);
  });

  it('reports a failed append on stderr and carries on', () => {
    fs.mkdirSync(eventsFilepath, { recursive: true });

    const { status, stderr, stdout } = runLogger(`
      logEvent({ type: 'visit' });
      console.log('still running');
    `);

    expect(status).toBe(0);
    expect(stderr).toStartWith(`Could not append to ${eventsFilepath}: `);
    expect(stdout).toBe('still running\n');
  });

  it('logs both levels and mirrors only the error level on stderr', () => {
    const { stderr } = runLogger(`
      logError('cache', 'a warning', { level: 'warn' });
      logError('solve', 'a failure');
    `);

    expect(stderr).toBe('solve: a failure\n');
    expect(readEvents().map(({ level, message }) => [level, message])).toEqual([
      ['warn', 'a warning'],
      ['error', 'a failure'],
    ]);
  });

  function runLogger(body: string): SpawnSyncReturns<string> {
    const script = `import { logError, logEvent } from ${JSON.stringify(LOGGER_MODULE)};\n${body}`;
    return spawnSync(process.execPath, ['-e', script], {
      cwd: home,
      encoding: 'utf8',
      env: { HOME: home, NODE_ENV: 'production' },
    });
  }

  function readEvents(): Record<string, unknown>[] {
    const lines = fs.readFileSync(eventsFilepath, 'utf8').trimEnd().split('\n');
    return lines.map((line) => JSON.parse(line) as Record<string, unknown>);
  }
});
