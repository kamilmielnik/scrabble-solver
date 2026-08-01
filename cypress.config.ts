import webpackPreprocessor from '@cypress/webpack-batteries-included-preprocessor';
import { defineConfig } from 'cypress';

// eslint-disable-next-line no-restricted-exports
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on) {
      // The preprocessor bundled with Cypress 15.19.0 cannot transpile specs under
      // TypeScript 7 - its @babel/preset-typescript copy ships without a package.json.
      // The npm-published preprocessor is intact, so register it explicitly.
      on('file:preprocessor', webpackPreprocessor({ typescript: require.resolve('typescript') }));
    },
    viewportHeight: 900,
    viewportWidth: 1440,
  },
});
