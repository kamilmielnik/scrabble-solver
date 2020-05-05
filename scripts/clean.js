import fs from 'fs-extra';

const paths = [
  './npm-debug.log',
  './dictionaries',
  './dist',
  './scrabble-solver-backend/build',
  './scrabble-solver-backend/dist',
  './scrabble-solver-frontend/build',
  './scrabble-solver-frontend/dist',
  './scrabble-solver-backend/node_modules',
  './scrabble-solver-commons/node_modules',
  './scrabble-solver-frontend/node_modules'
];

paths.forEach((path) => fs.remove(path));
