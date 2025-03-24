import { defineConfig } from 'cypress';

// eslint-disable-next-line no-restricted-exports
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportHeight: 900,
    viewportWidth: 1440,
  },
});
