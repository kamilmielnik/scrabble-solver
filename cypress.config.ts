import { defineConfig } from 'cypress';

const isProd = process.env.NODE_ENV === 'production';
const isCi = process.env.CI === 'true';

export default defineConfig({
  e2e: {
    baseUrl: isProd || isCi ? 'http://localhost:3333' : 'http://localhost:3000',
    viewportHeight: 900,
    viewportWidth: 1440,
  },
});
