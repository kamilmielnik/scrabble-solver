/**
 * Due to the use of npm workspaces we need to explicitly specify "@scrabble-solver/scrabble-solver"
 * package in the dependencies of this very "scrabble-solver" package. Otherwise none of
 * the "dependencies" from underlying packages/ would have been installed and any npm scripts
 * that work on subpackages would not work - specifically: npm start.
 *
 * This script exists to ensure that the dependency version is bumped during the release.
 */

const fs = require('fs');

const packageJsonString = fs.readFileSync('package.json', 'utf-8');
const packageJson = JSON.parse(packageJsonString);
const currentVersion = packageJson.dependencies['@scrabble-solver/scrabble-solver'];
const newVersion = packageJson.version;
const replaced = packageJsonString.replace(
  `"@scrabble-solver/scrabble-solver": "${currentVersion}"`,
  `"@scrabble-solver/scrabble-solver": "^${newVersion}"`,
);

fs.writeFileSync('package.json', replaced);
