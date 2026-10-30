/**
 * `bun run release [lerna version arguments]` - prompts for a version, and then tests and publishes it.
 * The tests run in the root "version" script: Lerna calls it after the bump and before the commit,
 * so what gets tested and packed is a build of the released version.
 *
 * `bun run release resume` - finishes a release which stopped after its commit: it publishes only
 * the packages missing from the registry, so it is safe to repeat at any time.
 */
import { deepEquals } from 'bun';
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { type Manifest, getPublishedPackages, ROOT_DIRECTORY } from './lib/tarballs';

const RELEASE_BRANCH = 'master';
const REPOSITORY = 'kamilmielnik/scrabble-solver';

const [firstArgument, ...otherArguments] = process.argv.slice(2);

if (firstArgument === 'resume') {
  restoreManifestsAfterFailedPublish();
} else {
  assertCleanReleaseBranch();
  run('bun', 'run', 'clean');
  run('bun', 'install', '--frozen-lockfile');
  run('bunx', 'lerna', 'version', ...(firstArgument ? [firstArgument] : []), ...otherArguments);
}

publish();

function publish(): void {
  const { version }: { version: string } = JSON.parse(readFileSync(path.join(ROOT_DIRECTORY, 'lerna.json'), 'utf8'));

  assertCleanReleaseBranch();
  assertHeadIsTagged(version);
  run('git', 'push', '--atomic', '--follow-tags', 'origin', RELEASE_BRANCH);
  run('bun', 'run', 'check-tarballs');
  run('bunx', 'lerna', 'publish', 'from-package', '--yes');
  assertEveryPackageIsPublished(version);
  createDraftRelease(version);
}

function assertCleanReleaseBranch(): void {
  const branch = read('git', 'branch', '--show-current');
  const changes = read('git', 'status', '--porcelain');

  if (branch !== RELEASE_BRANCH) {
    throw new Error(`Release from ${RELEASE_BRANCH}, not from ${branch}`);
  }

  if (changes) {
    throw new Error(`Release from a clean working tree:\n${changes}`);
  }
}

function assertHeadIsTagged(version: string): void {
  const tags = read('git', 'tag', '--points-at', 'HEAD').split('\n');

  if (!tags.includes(version)) {
    throw new Error(`HEAD is not tagged ${version}, so its tests did not pass in "lerna version"`);
  }
}

function assertEveryPackageIsPublished(version: string): void {
  const missing = getPublishedPackages()
    .map(({ manifest }) => manifest.name)
    .filter((name) => read('npm', 'view', `${name}@${version}`, 'version', '--prefer-online') !== version);

  if (missing.length > 0) {
    throw new Error(`Not on the registry: ${missing.join(', ')}. Finish with: bun run release resume`);
  }
}

function createDraftRelease(version: string): void {
  const { status } = spawnSync('gh', ['release', 'view', version, '--repo', REPOSITORY], { stdio: 'ignore' });

  if (status === 0) {
    return;
  }

  run(
    'gh',
    'release',
    'create',
    version,
    '--repo',
    REPOSITORY,
    '--draft',
    '--generate-notes',
    '--verify-tag',
    `--prerelease=${version.includes('-')}`,
  );
}

/**
 * A failed `lerna publish` leaves its temporary gitHead in the manifests and refuses to run again
 * on such a working tree. Any other change to a manifest stays in place for the clean tree check.
 */
function restoreManifestsAfterFailedPublish(): void {
  for (const { directory } of getPublishedPackages()) {
    const manifestPath = path.relative(ROOT_DIRECTORY, path.join(directory, 'package.json'));
    const manifest: Manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const committedManifest: Manifest = JSON.parse(read('git', 'show', `HEAD:${manifestPath}`));

    if (manifest.gitHead && deepEquals({ ...committedManifest, gitHead: manifest.gitHead }, manifest)) {
      run('git', 'checkout', 'HEAD', '--', manifestPath);
    }
  }
}

function read(command: string, ...args: string[]): string {
  return spawnSync(command, args, { cwd: ROOT_DIRECTORY, encoding: 'utf8' }).stdout.trim();
}

function run(command: string, ...args: string[]): void {
  execFileSync(command, args, { cwd: ROOT_DIRECTORY, stdio: 'inherit' });
}
