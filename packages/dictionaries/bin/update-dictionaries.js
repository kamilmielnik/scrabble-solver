#!/usr/bin/env node
/* eslint-disable */

const path = require('path');

const rootDirectory = path.resolve(__dirname, '..');
const { dictionaries } = require(rootDirectory);

const updateDictionaries = async () => {
  const failedLocales = await dictionaries.update();
  process.exitCode = failedLocales.length > 0 ? 1 : 0;
};

updateDictionaries();
