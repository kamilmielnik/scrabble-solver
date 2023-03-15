#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const rootDirectory = path.resolve(__dirname, '..');
process.chdir(rootDirectory);
execSync('npm start');
