/**
 * `bun run release [lerna version arguments]` - prompts for a version, and then tests and publishes it.
 * The tests run in the root "version" script: Lerna calls it after the bump and before the commit,
 * so what gets tested and packed is a build of the released version.
 *
 * `bun run release resume` - finishes a release which stopped after its commit: it publishes only
 * the packages missing from the registry, so it is safe to repeat at any time.
 */
import { deepEquals, sleepSync } from 'bun';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

interface Manifest {
  files?: string[];
  gitHead?: string;
  name: string;
  private?: boolean;
  workspaces?: string[];
}

interface PublishedPackage {
  directory: string;
  manifest: Manifest;
}

const REGISTRY_CHECK_ATTEMPTS = 60;
const REGISTRY_CHECK_INTERVAL_MS = 15_000;
const RELEASE_BRANCH = 'master';
const REPOSITORY = 'kamilmielnik/scrabble-solver';
const ROOT_DIRECTORY = path.resolve(import.meta.dirname, '..');

const [firstArgument, ...otherArguments] = process.argv.slice(2);

assertLoggedIn();

if (firstArgument === 'resume') {
  restoreManifestsAfterFailedPublish();
} else {
  assertCleanReleaseBranch();
  run('bun', 'run', 'clean');
  run('bun', 'install', '--frozen-lockfile');
  run('bunx', 'lerna', 'version', ...(firstArgument ? [firstArgument] : []), ...otherArguments);
}

publish();

function assertLoggedIn(): void {
  run('npm', 'whoami');
  run('gh', 'auth', 'status', '--active');
}

function publish(): void {
  const { version }: { version: string } = JSON.parse(readFileSync(path.join(ROOT_DIRECTORY, 'lerna.json'), 'utf8'));

  assertCleanReleaseBranch();
  assertHeadIsTagged(version);
  assertEveryPackageIsBuilt();
  run('git', 'push', '--atomic', '--follow-tags', 'origin', RELEASE_BRANCH);
  run('bunx', 'lerna', 'publish', 'from-package', '--yes');
  waitForEveryPackageOnRegistry(version);
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

function assertEveryPackageIsBuilt(): void {
  const unbuilt = getPublishedPackages()
    .filter(({ directory, manifest }) => !existsSync(path.join(directory, getBuildOutput(manifest))))
    .map(({ manifest }) => manifest.name);

  if (unbuilt.length > 0) {
    throw new Error(`Packing these would publish no code: ${unbuilt.join(', ')}. First run: bun run build`);
  }
}

function getBuildOutput({ files }: Manifest): string {
  return files?.includes('.next') ? path.join('.next', 'BUILD_ID') : 'build';
}

function waitForEveryPackageOnRegistry(version: string): void {
  let missing = getPublishedPackages().map(({ manifest }) => manifest.name);

  for (let attempt = 1; attempt <= REGISTRY_CHECK_ATTEMPTS; attempt++) {
    missing = missing.filter((name) => !isOnRegistry(name, version));

    if (missing.length === 0) {
      return;
    }

    console.log(`Not on the registry yet (attempt ${attempt}/${REGISTRY_CHECK_ATTEMPTS}): ${missing.join(', ')}`);
    sleepSync(REGISTRY_CHECK_INTERVAL_MS);
  }

  throw new Error(`Not on the registry: ${missing.join(', ')}. Finish with: bun run release resume`);
}

function isOnRegistry(name: string, version: string): boolean {
  return read('npm', 'view', `${name}@${version}`, 'version', '--prefer-online') === version;
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
    const manifest = readManifest(directory);
    const committedManifest: Manifest = JSON.parse(read('git', 'show', `HEAD:${manifestPath}`));

    if (manifest.gitHead && deepEquals({ ...committedManifest, gitHead: manifest.gitHead }, manifest)) {
      run('git', 'checkout', 'HEAD', '--', manifestPath);
    }
  }
}

function getPublishedPackages(): PublishedPackage[] {
  const { workspaces = [] } = readManifest(ROOT_DIRECTORY);

  return workspaces
    .map((workspace) => path.join(ROOT_DIRECTORY, workspace))
    .map((directory) => ({ directory, manifest: readManifest(directory) }))
    .filter(({ manifest }) => !manifest.private);
}

function readManifest(directory: string): Manifest {
  return JSON.parse(readFileSync(path.join(directory, 'package.json'), 'utf8'));
}

function read(command: string, ...args: string[]): string {
  return spawnSync(command, args, { cwd: ROOT_DIRECTORY, encoding: 'utf8' }).stdout.trim();
}

function run(command: string, ...args: string[]): void {
  execFileSync(command, args, { cwd: ROOT_DIRECTORY, stdio: 'inherit' });
}
