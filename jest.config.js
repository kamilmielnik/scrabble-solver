const tsConfig = require('./tsconfig.jest.json');

module.exports = {
  coveragePathIgnorePatterns: ['/node_modules/', '/build/'],
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
  transform: {
    '^.+.tsx?$': ['ts-jest', tsConfig],
  },
};
