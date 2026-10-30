/**
 * Fails when a package would be published with files it should not ship, without files it needs,
 * or - in the case of the app - with a build of another version than the one in its package.json.
 * Requires a build - `bun run build`.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { type Tarball, packTarballs } from './lib/tarballs';

interface TarballRules {
  allowed: string[];
  required: string[];
}

const LIBRARY_RULES: TarballRules = {
  allowed: ['README.md', 'build/', 'package.json'],
  required: ['README.md', 'build/index.d.ts', 'build/index.js', 'package.json'],
};

const APP_INDEX_PAGE = '.next/server/pages/index.html';

const TARBALL_RULES: Record<string, TarballRules> = {
  '@scrabble-solver/configs': LIBRARY_RULES,
  '@scrabble-solver/constants': LIBRARY_RULES,
  '@scrabble-solver/dictionaries': {
    allowed: [...LIBRARY_RULES.allowed, 'bin/'],
    required: [...LIBRARY_RULES.required, 'bin/remove-dictionaries.js', 'bin/update-dictionaries.js'],
  },
  '@scrabble-solver/logger': LIBRARY_RULES,
  '@scrabble-solver/solver': LIBRARY_RULES,
  '@scrabble-solver/types': LIBRARY_RULES,
  '@scrabble-solver/word-definitions': LIBRARY_RULES,
  '@scrabble-solver/word-lists': LIBRARY_RULES,
  'scrabble-solver': {
    allowed: ['.env', '.next/', 'README.md', 'bin/', 'next.config.js', 'package.json', 'public/'],
    required: [
      '.env',
      '.next/BUILD_ID',
      APP_INDEX_PAGE,
      '.next/server/pages/api/solve.js',
      '.next/static/',
      'README.md',
      'bin/scrabble-solver.js',
      'next.config.js',
      'package.json',
      'public/robots.txt',
      'public/service-worker.js',
    ],
  },
};

const FORBIDDEN_FILES = [
  /(^|\/)node_modules\//,
  /\.map$/,
  /\.nft\.json$/,
  /\.test\.[jt]sx?$/,
  /\.tsbuildinfo$/,
  /^\.next\/(cache|dev|diagnostics|types)\//,
  /^\.next\/trace(-build)?$/,
];

const directory = mkdtempSync(path.join(os.tmpdir(), 'scrabble-solver-check-tarballs-'));

try {
  const tarballs = packTarballs(directory);
  const problems = tarballs.flatMap((tarball) => getProblems(tarball, tarballs));

  if (problems.length > 0) {
    console.error(`Tarball check failed:\n${problems.map((problem) => `- ${problem}`).join('\n')}`);
    process.exitCode = 1;
  } else {
    console.log(`Tarball check passed for ${tarballs.length} packages`);
  }
} finally {
  rmSync(directory, { force: true, recursive: true });
}

function getProblems(tarball: Tarball, tarballs: Tarball[]): string[] {
  const { name } = tarball.manifest;
  const rules = TARBALL_RULES[name];

  if (!rules) {
    return [`${name}: add it to TARBALL_RULES`];
  }

  const files = listFiles(tarball);

  return [
    ...getManifestProblems(tarball, files, tarballs),
    ...rules.required
      .filter((required) => !files.some((file) => file === required || file.startsWith(required)))
      .map((required) => `is missing ${required}`),
    ...files
      .filter((file) => !rules.allowed.some((allowed) => file === allowed || file.startsWith(allowed)))
      .map((file) => `must not ship ${file}`),
    ...files
      .filter((file) => FORBIDDEN_FILES.some((forbidden) => forbidden.test(file)))
      .map((file) => `must not ship ${file}`),
    ...(name === 'scrabble-solver' ? getAppVersionProblems(tarball, files) : []),
  ].map((problem) => `${name}: ${problem}`);
}

function getManifestProblems(tarball: Tarball, files: string[], tarballs: Tarball[]): string[] {
  const { bin = {}, dependencies = {}, gitHead, version } = tarball.manifest;
  const versions = new Map(tarballs.map(({ manifest }) => [manifest.name, manifest.version]));

  return [
    ...(gitHead ? ['has a stale gitHead'] : []),
    ...Object.values(bin)
      .filter((file) => file.startsWith('./'))
      .map((file) => `bin path ${file} starts with ./ (npm removes such entries when publishing)`),
    ...Object.values(bin)
      .filter((file) => !files.includes(file))
      .map((file) => `does not ship its bin ${file}`),
    ...(version === versions.get('scrabble-solver') ? [] : [`version ${version} differs from the app's version`]),
    ...Object.entries(dependencies)
      .filter(([dependency]) => dependency.startsWith('@scrabble-solver/'))
      .filter(([dependency, range]) => versions.get(dependency) !== range)
      .map(([dependency, range]) => `depends on ${dependency}@${range}, which is not being published`),
  ];
}

function getAppVersionProblems(tarball: Tarball, files: string[]): string[] {
  if (!files.includes(APP_INDEX_PAGE)) {
    return [];
  }

  const page = execFileSync(
    'tar',
    ['--extract', '--gzip', '--to-stdout', '--file', tarball.file, `package/${APP_INDEX_PAGE}`],
    {
      encoding: 'utf8',
      maxBuffer: Infinity,
    },
  );
  const { version } = tarball.manifest;

  return page.includes(`"version":"v${version}"`) ? [] : [`${APP_INDEX_PAGE} was not built from version ${version}`];
}

function listFiles({ file }: Tarball): string[] {
  const output = execFileSync('tar', ['--list', '--gzip', '--file', file], { encoding: 'utf8', maxBuffer: Infinity });

  return output
    .split('\n')
    .filter(Boolean)
    .map((entry) => entry.replace(/^package\//, ''));
}
