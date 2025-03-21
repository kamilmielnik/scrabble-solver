/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');
const WorkboxPlugin = require('workbox-webpack-plugin');

const tsConfig = fs.readFileSync(path.resolve(__dirname, 'tsconfig.json'), 'utf-8');
const tsConfigJson = JSON.parse(tsConfig);
const tsConfigAliases = Object.keys(tsConfigJson.compilerOptions.paths).reduce(
  (result, key) => ({
    ...result,
    [key]: path.resolve(__dirname, tsConfigJson.compilerOptions.paths[key][0]),
  }),
  {},
);

module.exports = {
  compress: false,
  reactStrictMode: true,
  webpack: (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        ...tsConfigAliases,
      },
    },
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.svg$/,
          include: [path.resolve(__dirname, 'src/icons')],
          issuer: /\.tsx?$/,
          use: ['@svgr/webpack'],
        },
      ],
    },
    plugins: [
      ...config.plugins,
      process.env.NODE_ENV === 'production'
        ? new WorkboxPlugin.InjectManifest({
            swSrc: path.join(__dirname, 'src/service-worker/index.ts'),
            swDest: path.join(__dirname, 'public/service-worker.js'),
            exclude: [/\.map$/, /\.next/, /_next/, /manifest/, /\.htaccess$/, /.*\/static\/.*/, /service-worker\.js$/],
          })
        : undefined,
    ].filter(Boolean),
  }),
};
