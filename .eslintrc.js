module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],

  extends: ['@kamilmielnik/eslint-config'],

  parserOptions: {
    allowImportExportEverywhere: true,
    babelOptions: {
      babelrc: false,
      configFile: false,
      presets: ['@babel/preset-env'],
    },
    project: true,
    requireConfigFile: false,
    tsconfigRootDir: __dirname,
  },

  env: {
    browser: true,
    node: true,
  },

  globals: {
    RequestInfo: true,
    RequestInit: true,
    ServiceWorkerGlobalScope: true,
    beforeAll: true,
    define: true,
    describe: true,
    expect: true,
    globalThis: true,
    it: true,
    jest: true,
  },

  rules: {
    'sort-keys': ['off'],
    '@typescript-eslint/consistent-type-exports': 'off',
  },
};
