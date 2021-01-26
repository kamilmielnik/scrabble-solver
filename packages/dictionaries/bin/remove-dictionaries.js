#!/usr/bin/env node
/* eslint-disable */

const path = require('path');

const rootDirectory = path.resolve(__dirname, '..');
const { dictionaries } = require(rootDirectory);

dictionaries.remove();
