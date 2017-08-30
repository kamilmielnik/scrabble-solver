import path from 'path';
import { execSync } from 'child_process';
import { logAction, tryRemovingDirectory } from './utils.js';

const COMMONS_NAME = 'scrabble-solver-commons';
const dirname = path.join(__dirname, '..');

const updateCommons = () => {
  buildCommons();
  updateModule('backend');
  updateModule('frontend');
};

const buildCommons = () => {
  process.chdir(path.join(dirname, 'commons'));
  logAction(`Installing ${COMMONS_NAME} dependencies`, () => {
    execSync('npm install');
  });
  logAction(`Building ${COMMONS_NAME}`, () => {
    execSync('npm run build');
  });
};

const updateModule = (moduleName) => {
  process.chdir(path.join(dirname));
  tryRemovingDirectory(path.join(dirname, moduleName, 'node_modules', COMMONS_NAME));
  process.chdir(path.join(dirname, moduleName));
  logAction(`Updating "${COMMONS_NAME}" in "${moduleName}"`, () => {
    execSync(`npm install ${COMMONS_NAME}`);
  });
};

updateCommons();
