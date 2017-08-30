import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { logAction } from './utils.js';

const dirname = path.join(__dirname, '..');
const OUTPUT_DIRECTORY = path.join(dirname, 'dist');
const DICTIONARY = path.join(dirname, 'dictionary.json');

const build = () => {
  buildModule('backend');
  buildModule('frontend');
  fs.copySync(DICTIONARY, path.join(OUTPUT_DIRECTORY, 'dictionary.json'));
};

const buildModule = (moduleName) => {
  const moduleDirectory = path.join(dirname, moduleName);
  const distDirectory = path.join(moduleDirectory, 'dist');
  process.chdir(moduleDirectory);
  logAction(`Installing "${moduleName}" dependencies`, () => {
    execSync('npm install');
  });
  logAction(`Building "${moduleName}"`, () => {
    execSync('npm run build');
    fs.copySync(distDirectory, path.join(OUTPUT_DIRECTORY, moduleName));
  });
};

build();
