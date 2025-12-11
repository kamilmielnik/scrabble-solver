/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  compress: false,
  reactStrictMode: true,
  sassOptions: {
    loadPaths: ['./src', path.join(__dirname, '../../node_modules/include-media/dist')],
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
