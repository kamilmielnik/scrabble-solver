import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

const CONSTANTS_MODULE = path.join(import.meta.dir, 'constants.ts');
const LOG_EVENT_MODULE = path.join(import.meta.dir, 'logEvent.ts');

describe('constants', () => {
  let home: string;

  beforeEach(() => {
    home = fs.mkdtempSync(path.join(os.tmpdir(), 'logger-constants-'));
  });

  afterEach(() => {
    fs.rmSync(home, { force: true, recursive: true });
  });

  it('keeps every path under the home directory', () => {
    expect(readConstants({ NODE_ENV: 'production' })).toMatchObject({
      CSV_DIRECTORY: path.join(home, '.scrabble-solver', 'csv'),
      EVENTS_FILEPATH: path.join(home, '.scrabble-solver', 'logs', 'events.txt'),
      OUTPUT_DIRECTORY: path.join(home, '.scrabble-solver', 'logs'),
    });
  });

  it.each([
    ['production', { NODE_ENV: 'production' }, false],
    ['development', { NODE_ENV: 'development' }, false],
    ['unset', {}, false],
    ['test', { NODE_ENV: 'test' }, true],
  ])('outside the test runner with NODE_ENV %s, sets the test run flag accordingly', (_name, env, isTestRun) => {
    expect(readConstants(env)).toMatchObject({ IS_TEST_RUN: isTestRun });
  });

  it('marks a test run under an inherited NODE_ENV, so the test runner cannot reach the real log', () => {
    const output = runInTestRunner();

    expect(output).toContain('IS_TEST_RUN=true');
    expect(output).toContain('NODE_ENV=production');
    expect(fs.existsSync(path.join(home, '.scrabble-solver'))).toBe(false);
  });

  function readConstants(env: Record<string, string>): Record<string, unknown> {
    const script = `
      import * as constants from ${JSON.stringify(CONSTANTS_MODULE)};
      console.log(JSON.stringify(constants));
    `;
    const { stdout } = spawnSync(process.execPath, ['-e', script], {
      encoding: 'utf8',
      env: { HOME: home, ...env },
    });
    return JSON.parse(stdout) as Record<string, unknown>;
  }

  function runInTestRunner(): string {
    const testFile = path.join(home, 'inherited-env.test.ts');
    fs.writeFileSync(
      testFile,
      `
      import { IS_TEST_RUN } from ${JSON.stringify(CONSTANTS_MODULE)};
      import { logEvent } from ${JSON.stringify(LOG_EVENT_MODULE)};

      it('logs', () => {
        logEvent({ type: 'visit' });
        console.log('IS_TEST_RUN=' + IS_TEST_RUN, 'NODE_ENV=' + process.env.NODE_ENV);
      });
      `,
    );
    const { stdout } = spawnSync(process.execPath, ['test', testFile], {
      cwd: home,
      encoding: 'utf8',
      env: { HOME: home, NODE_ENV: 'production' },
    });
    return stdout;
  }
});
