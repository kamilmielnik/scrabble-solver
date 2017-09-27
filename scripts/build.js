import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { logAction } from './utils.js';

const env = process.argv[2] || '';

const dirname = path.join(__dirname, '..');
const DICTIONARY_FILENAME = 'dictionary.txt';
const INPUT_DICTIONARY = path.join(dirname, DICTIONARY_FILENAME);
const OUTPUT_DIRECTORY = path.join(dirname, 'dist');
const OUTPUT_DICTIONARY = path.join(OUTPUT_DIRECTORY, DICTIONARY_FILENAME);

const build = () => {
  buildModule('scrabble-solver-backend');
  buildModule('scrabble-solver-frontend');
  fs.copySync(INPUT_DICTIONARY, OUTPUT_DICTIONARY);
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
    fs.copySync(distDirectory, path.join(OUTPUT_DIRECTORY, moduleName));
  });
};

build();
