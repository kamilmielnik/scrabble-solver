import { type Mock, afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';
import fs from 'fs';
import os from 'os';
import path from 'path';

import type * as constantsModule from './constants';
import type * as logErrorModule from './logError';

const TEST_DIRECTORY = fs.mkdtempSync(path.join(os.tmpdir(), 'logger-log-error-'));
const OUTPUT_DIRECTORY = path.join(TEST_DIRECTORY, 'logs');
const EVENTS_FILEPATH = path.join(OUTPUT_DIRECTORY, 'events.txt');
const STACK = 'Error: boom\n    at solve (/app/solve.ts:1:1)\n    at handler (/app/api.ts:2:2)';
const STDERR_ENTRY = 'solve: Error: boom\n    at solve (/app/solve.ts:1:1)\n    at handler (/app/api.ts:2:2)\n';

await mockConstants({ isTestRun: true });

const { logError }: typeof logErrorModule = await import('./logError');

describe('logError', () => {
  let stderrWrite: Mock<typeof process.stderr.write>;

  beforeAll(async () => {
    const constants: typeof constantsModule = await import('./constants');

    expect(constants.EVENTS_FILEPATH).toBe(EVENTS_FILEPATH);
  });

  beforeEach(async () => {
    await mockConstants({ isTestRun: false });
    stderrWrite = spyOn(process.stderr, 'write').mockImplementation(() => true);
  });

  afterEach(async () => {
    await mockConstants({ isTestRun: true });
    stderrWrite.mockRestore();
    fs.rmSync(OUTPUT_DIRECTORY, { force: true, recursive: true });
  });

  afterAll(() => {
    fs.rmSync(TEST_DIRECTORY, { force: true, recursive: true });
  });

  describe('event', () => {
    it('logs an error event at error level by default', () => {
      logError('solve', createError(STACK));

      expect(readEvents()).toEqual([
        {
          timestamp: expect.any(String) as string,
          type: 'error',
          level: 'error',
          operation: 'solve',
          message: 'Error: boom',
          stack: STACK,
        },
      ]);
    });

    it('falls back to error level when the context leaves the level undefined', () => {
      logError('solve', createError(STACK), { level: undefined });

      expect(readEvents()[0].level).toBe('error');
    });

    it('takes the level from the context', () => {
      logError('cache', createError(STACK), { level: 'warn' });

      expect(readEvents()[0].level).toBe('warn');
    });

    it('merges the context into the event', () => {
      logError('solve', 'boom', { input: '{"rack":"abc"}', ip: '::1', locale: 'pl-PL', ua: 'Mozilla/5.0' });

      expect(readEvents()[0]).toMatchObject({
        locale: 'pl-PL',
        ip: '::1',
        ua: 'Mozilla/5.0',
        message: 'boom',
        input: '{"rack":"abc"}',
      });
    });

    it('leaves context fields that are undefined out of the line', () => {
      logError('solve', createError(STACK), { ip: undefined });

      expect(Object.keys(readEvents()[0])).not.toContain('ip');
    });

    it('describes nested errors in the message', () => {
      logError('build', new Error('Could not build', { cause: new TypeError('fetch failed') }));

      expect(readEvents()[0].message).toBe('Error: Could not build (TypeError: fetch failed)');
    });

    it.each([
      ['a string', 'boom', 'boom'],
      ['undefined', undefined, 'undefined'],
      ['null', null, 'null'],
      ['a number', 42, '42'],
      ['an object', { code: 500 }, '[object Object]'],
    ])('stringifies %s and logs no stack', (_name, value, message) => {
      logError('solve', value);

      expect(readEvents()[0]).toMatchObject({ level: 'error', message });
      expect(Object.keys(readEvents()[0])).not.toContain('stack');
    });
  });

  describe('stderr', () => {
    it('mirrors an error-level event with the operation, the message and the stack frames', () => {
      logError('solve', createError(STACK));

      expect(getStderr()).toBe(STDERR_ENTRY);
    });

    it('keeps stack frames only', () => {
      const stack = [
        'Error: boom',
        'second line of the message',
        '  at shallow indentation',
        '    at solve (/app/solve.ts:1:1)',
        '    not a frame',
        'at no indentation',
        '    at handler (/app/api.ts:2:2)',
      ].join('\n');

      logError('solve', createError(stack));

      expect(getStderr()).toBe(STDERR_ENTRY);
    });

    it('prints the whole description of a nested error', () => {
      const error = new Error('Could not build', { cause: new TypeError('fetch failed') });
      logError('build', Object.assign(error, { stack: 'no frames' }));

      expect(getStderr()).toBe('build: Error: Could not build (TypeError: fetch failed)\n');
    });

    it('prints one line for a value without a stack', () => {
      logError('solve', 'boom');

      expect(getStderr()).toBe('solve: boom\n');
    });

    it('prints one line for an error whose stack is missing', () => {
      logError('solve', createError(undefined));

      expect(getStderr()).toBe('solve: Error: boom\n');
    });

    it('stays silent for a warning, which is still logged', () => {
      logError('cache', createError(STACK), { level: 'warn' });

      expect(stderrWrite).not.toHaveBeenCalled();
      expect(readEvents()).toHaveLength(1);
    });

    it('stays silent in a test run, when nothing is logged either', async () => {
      await mockConstants({ isTestRun: true });

      logError('solve', createError(STACK));

      expect(stderrWrite).not.toHaveBeenCalled();
      expect(fs.existsSync(OUTPUT_DIRECTORY)).toBe(false);
    });

    it('still mirrors the error when the events file cannot be appended to', () => {
      fs.mkdirSync(EVENTS_FILEPATH, { recursive: true });

      expect(() => {
        logError('solve', 'boom');
      }).not.toThrow();

      expect(getStderr()).toStartWith(`Could not append to ${EVENTS_FILEPATH}: `);
      expect(getStderr()).toEndWith('solve: boom\n');
    });
  });

  function getStderr(): string {
    return stderrWrite.mock.calls.map(([text]) => String(text)).join('');
  }
});

function createError(stack: string | undefined): Error {
  return Object.assign(new Error('boom'), { stack });
}

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
