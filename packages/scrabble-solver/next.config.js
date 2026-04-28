/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  compress: false,
  reactStrictMode: true,
  sassOptions: {
    loadPaths: ['./src', path.join(__dirname, '../../node_modules/include-media/dist')],
    quietDeps: true,
  },
  // Force HTML revalidation on every navigation. Next.js's SSG ETag is derived from
  // the page-data hash (the getStaticProps output), so getStaticProps embeds a per-build
  // SHA to make that hash — and therefore the ETag — change between deploys. Without
  // it, an unchanged page-data lets the browser 304 stale HTML that points at chunks
  // the new server no longer has.
  async headers() {
    const cacheControl = { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' };
    return [
      { source: '/', headers: [cacheControl] },
      { source: '/404', headers: [cacheControl] },
      { source: '/not-found', headers: [cacheControl] },
    ];
  },
  webpack(config, { isServer, dev }) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    if (!isServer && !dev) {
      config.plugins.push(
        new WorkboxPlugin.InjectManifest({
          swSrc: path.join(__dirname, 'src/service-worker/index.ts'),
          swDest: path.join(__dirname, 'public/service-worker.js'),
          exclude: [/\.map$/, /\.next/, /_next/, /manifest/, /\.htaccess$/, /.*\/static\/.*/, /service-worker\.js$/],
        }),
      );
    }

    return config;
  },
};
