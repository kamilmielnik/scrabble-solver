/**
 * Runs the e2e suite against what would be published: packs every package, installs the tarballs in
 * a project outside of this repository (the way `bunx` and `npx` do) and starts the installed binary.
 * Requires a build - `bun run build`.
 */
import { sleep } from 'bun';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { type Tarball, packTarballs, ROOT_DIRECTORY } from './lib/tarballs';

const APP_URL = 'http://localhost:3333';
const PACKAGE_MANAGERS = ['bun', 'npm'];
const PORT_RELEASE_TIMEOUT = 30_000;
const PORT_RELEASE_POLL_INTERVAL = 500;

const directory = mkdtempSync(path.join(os.tmpdir(), 'scrabble-solver-test-tarballs-'));

try {
  const tarballs = packTarballs(directory);

  for (const packageManager of PACKAGE_MANAGERS) {
    await testInstallation(packageManager, tarballs);
  }
} finally {
  rmSync(directory, { force: true, recursive: true });
}

async function testInstallation(packageManager: string, tarballs: Tarball[]): Promise<void> {
  const project = path.join(directory, packageManager);

  mkdirSync(project);
  writeFileSync(path.join(project, 'package.json'), JSON.stringify(getProjectManifest(tarballs)));
  execFileSync(packageManager, ['install'], { cwd: project, stdio: 'inherit' });

  // A leftover server on this port would have the e2e suite pass against the wrong app.
  await waitForPortRelease();

  const binary = path.join(project, 'node_modules/.bin/scrabble-solver');
  execFileSync('bunx', ['start-server-and-test', binary, APP_URL, 'test-playwright:run'], {
    cwd: ROOT_DIRECTORY,
    stdio: 'inherit',
  });
}

/**
 * Overrides make the app's own dependencies on the other packages resolve to the tarballs too,
 * because these versions may not be on the registry yet.
 */
function getProjectManifest(tarballs: Tarball[]) {
  const specifiers = tarballs.map(({ file, manifest }) => [manifest.name, `file:${file}`]);
  const { 'scrabble-solver': app, ...libraries } = Object.fromEntries(specifiers);

  return { dependencies: { 'scrabble-solver': app }, name: 'tarballs-consumer', overrides: libraries, private: true };
}

async function waitForPortRelease(): Promise<void> {
  const deadline = Date.now() + PORT_RELEASE_TIMEOUT;

  while (await isAppRunning()) {
    if (Date.now() > deadline) {
      throw new Error(`Something still listens at ${APP_URL}`);
    }

    await sleep(PORT_RELEASE_POLL_INTERVAL);
  }
}

async function isAppRunning(): Promise<boolean> {
  try {
    await fetch(APP_URL);
    return true;
  } catch {
    return false;
  }
}
