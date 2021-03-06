#!/usr/bin/env node
/* eslint-disable */

const path = require('path');

const rootDirectory = path.resolve(__dirname, '..');

try {
  const { dictionaries } = require(rootDirectory);
  dictionaries.remove();
} catch (error) {
  console.error(error);
}
