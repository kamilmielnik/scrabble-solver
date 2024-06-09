/**
 * Due to the use of npm workspaces we need to explicitly specify "@scrabble-solver/scrabble-solver"
 * package in the dependencies of this very "scrabble-solver" package. Otherwise none of
 * the "dependencies" from underlying packages/ would have been installed and any npm scripts
 * that work on subpackages would not work - specifically: npm start.
 *
 * This script exists to ensure that the dependency version is bumped during the release.
 */

const fs = require('fs');

const getCurrentAppVersion = () => {
  const packageJson = require('./packages/scrabble-solver/package.json');
  return packageJson.version;
};

const updateDependencyVersion = (filename, dependency, version) => {
  const packageJsonString = fs.readFileSync(filename, 'utf-8');
  const replacement = `"${dependency}": "^${version}",`;
  const replaced = packageJsonString.replace(new RegExp(`"${dependency}": ".*",`), replacement);

  fs.writeFileSync(filename, replaced);
};

const currentAppVersion = getCurrentAppVersion();
updateDependencyVersion('package.json', '@scrabble-solver/scrabble-solver', currentAppVersion);
updateDependencyVersion('package-lock.json', '@scrabble-solver/scrabble-solver', currentAppVersion);
