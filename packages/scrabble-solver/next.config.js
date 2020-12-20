const path = require('path');
const fs = require('fs');

const tsConfig = fs.readFileSync('tsconfig.json', 'utf-8');
const tsConfigJson = JSON.parse(tsConfig);
const tsConfigAliases = Object.keys(tsConfigJson.compilerOptions.paths).reduce(
  (result, key) => ({
    ...result,
    [key]: path.resolve(__dirname, tsConfigJson.compilerOptions.paths[key][0])
  }),
  {}
);

module.exports = {
  compress: false,
  devIndicators: {
    autoPrerender: false,
    buildActivity: false
  },
  reactStrictMode: true,
  webpack: (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        ...tsConfigAliases
      }
    },
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.svg$/,
          loader: 'svg-sprite-loader'
        }
      ]
    }
  })
};
