import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { logAction } from './utils.js';

const env = process.argv[2] || '';

const dirname = path.join(__dirname, '..');
const DICTIONARY_DIRECTORY_NAME = 'dictionaries';
const DICTIONARIES_PATH = path.join(dirname, DICTIONARY_DIRECTORY_NAME);
const TARGET_DIRECTORY = path.join(dirname, 'dist');
const TARGET_DICTIONARIES_PATH = path.join(TARGET_DIRECTORY, DICTIONARY_DIRECTORY_NAME);

const build = () => {
  buildModule('packages/backend');
  buildModule('packages/frontend');
  fs.copySync(DICTIONARIES_PATH, TARGET_DICTIONARIES_PATH);
};

const buildModule = (moduleName) => {
  const moduleDirectory = path.join(dirname, moduleName);
  const distDirectory = path.join(moduleDirectory, 'dist');
  process.chdir(moduleDirectory);
  logAction(`Installing "${moduleName}" dependencies`, () => {
    execSync('npm install');
  });
  logAction(`Building "${moduleName}"`, () => {
    const npmScript = env ? `build:${env}` : 'build';
    execSync(`npm run ${npmScript}`);
    fs.copySync(distDirectory, path.join(TARGET_DIRECTORY, moduleName));
  });
};

build();
