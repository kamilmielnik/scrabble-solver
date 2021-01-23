module.exports = {
  coveragePathIgnorePatterns: ['/node_modules/', '/build/'],
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
    },
  },
};
