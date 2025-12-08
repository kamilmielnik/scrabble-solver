/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  compress: false,
  reactStrictMode: true,
  sassOptions: {
    loadPaths: ['./src',  path.join(__dirname, '../../node_modules/include-media/dist')],
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
    plugins: [
      process.env.NODE_ENV === 'production'
        ? new WorkboxPlugin.InjectManifest({
            swSrc: path.join(__dirname, 'src/service-worker/index.ts'),
            swDest: path.join(__dirname, 'public/service-worker.js'),
            exclude: [/\.map$/, /\.next/, /_next/, /manifest/, /\.htaccess$/, /.*\/static\/.*/, /service-worker\.js$/],
          })
        : undefined,
    ].filter(Boolean),
  },
};
