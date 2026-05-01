/**
 * Due to the use of Bun workspaces we need to explicitly specify "@scrabble-solver/scrabble-solver"
 * package in the dependencies of this very "scrabble-solver" package. Otherwise none of
 * the "dependencies" from underlying packages/ would have been installed and any package scripts
 * that work on subpackages would not work - specifically: bun start.
 *
 * This script ensures the dependency version in the root package.json and the workspace metadata
 * in bun.lock (each package's "version" field and every "@scrabble-solver/*" inter-package
 * dependency) are synced to the current app version after `lerna version --force-publish` has
 * bumped the per-package package.json files in lockstep.
 */

const fs = require('fs');

const getCurrentAppVersion = () => {
  const packageJson = require('./packages/scrabble-solver/package.json');
  return packageJson.version;
};

const updateRootPackageJson = (filename, version) => {
  const content = fs.readFileSync(filename, 'utf-8');
  const replaced = content.replace(
    /("@scrabble-solver\/scrabble-solver":\s*)"[^"]+"/,
    `$1"^${version}"`,
  );

  fs.writeFileSync(filename, replaced);
};

const updateBunLock = (filename, version) => {
  let content = fs.readFileSync(filename, 'utf-8');

  content = content.replace(
    /("@scrabble-solver\/[^"]+":\s*)"\^[^"]+"/g,
    `$1"^${version}"`,
  );

  content = content.replace(
    /("version":\s*)"[^"]+"/g,
    `$1"${version}"`,
  );

  fs.writeFileSync(filename, content);
};

const currentAppVersion = getCurrentAppVersion();
updateRootPackageJson('package.json', currentAppVersion);
updateBunLock('bun.lock', currentAppVersion);
