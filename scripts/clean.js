import fs from 'fs-extra';

const directories = [
  './dictionaries',
  './dist',
  './npm-debug.log',
  './scrabble-solver-backend/node_modules',
  './scrabble-solver-frontend/node_modules'
];

directories.forEach((directory) => fs.remove(directory));
