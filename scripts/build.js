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
  bootstrap();
  buildModule({
    name: 'backend',
    directory: 'packages/backend',
    dist: 'dist'
  });
  buildModule({
    name: 'frontend',
    directory: 'packages/frontend',
    dist: 'build'
  });
  fs.copySync(DICTIONARIES_PATH, TARGET_DICTIONARIES_PATH);
};

const bootstrap = () => {
  logAction('Bootstrapping', () => {
    process.chdir(dirname);
    execSync('lerna bootstrap');
  });
};

const buildModule = ({ name, directory, dist }) => {
  const moduleDirectory = path.join(dirname, directory);
  const distDirectory = path.join(moduleDirectory, dist);
  const targetDirectory = path.join(TARGET_DIRECTORY, name);
  process.chdir(moduleDirectory);
  logAction(`Building "${name}"`, () => {
    const npmScript = env ? `build:${env}` : 'build';
    execSync(`npm run ${npmScript}`);
    fs.copySync(distDirectory, targetDirectory);
  });
};

build();
