#!/usr/bin/env node

const path = require('path');
const { execSync } = require('child_process');

const rootDirectory = path.join(__dirname, '..');
process.chdir(rootDirectory);
execSync('npm start');
