#!/usr/bin/env node
/* eslint-disable */

const path = require('path');

const rootDirectory = path.join(__dirname, '..');
const { dictionaries } = require(rootDirectory);

dictionaries.update();
