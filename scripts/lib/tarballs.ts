import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

export interface Manifest {
  bin?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  gitHead?: string;
  name: string;
  private?: boolean;
  version: string;
  workspaces?: string[];
}

export interface PublishedPackage {
  directory: string;
  manifest: Manifest;
}

export interface Tarball extends PublishedPackage {
  file: string;
}

export const ROOT_DIRECTORY = path.resolve(import.meta.dirname, '../..');

export function getPublishedPackages(): PublishedPackage[] {
  const { workspaces = [] } = readManifest(ROOT_DIRECTORY);

  return workspaces
    .map((workspace) => path.join(ROOT_DIRECTORY, workspace))
    .map((directory) => ({ directory, manifest: readManifest(directory) }))
    .filter(({ manifest }) => !manifest.private);
}

/**
 * npm has to run outside of the repository: inside it, it packs in workspace mode, where the rules
 * of the root .gitignore apply. `lerna publish` knows nothing about workspaces, so neither may we.
 */
export function packTarballs(destination: string): Tarball[] {
  return getPublishedPackages().map((publishedPackage) => {
    const output = execFileSync(
      'npm',
      ['pack', publishedPackage.directory, '--loglevel', 'error', '--pack-destination', destination],
      {
        cwd: destination,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'inherit'],
      },
    );
    const filename = output.trim().split('\n').at(-1) ?? '';

    return { ...publishedPackage, file: path.join(destination, filename) };
  });
}

function readManifest(directory: string): Manifest {
  return JSON.parse(readFileSync(path.join(directory, 'package.json'), 'utf8'));
}
