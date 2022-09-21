const tsConfig = require('./tsconfig.jest.json');

module.exports = {
  coveragePathIgnorePatterns: ['/node_modules/', '/build/'],
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', tsConfig],
  },
};
