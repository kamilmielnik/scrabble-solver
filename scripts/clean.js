import fs from 'fs-extra';

const paths = [
  './npm-debug.log',
  './dictionaries',
  './dist',
  './packages/backend/dist',
  './packages/frontend/build',
  './packages/backend/node_modules',
  './packages/configs/node_modules',
  './packages/frontend/node_modules',
  './packages/logger/node_modules',
  './packages/solver/node_modules'
];

paths.forEach((path) => fs.remove(path));
