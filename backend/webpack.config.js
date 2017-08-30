const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');

const IS_DEV_ENV = process.env.NODE_ENV === 'development';
const IS_PROD_ENV = process.env.NODE_ENV === 'production';

const SRC_DIR = path.resolve(__dirname, 'src');
const DIST_DIR = path.resolve(__dirname, 'dist');
const BUNDLE_DIST = 'index.js';

module.exports = {
  output: {
    path: DIST_DIR,
    filename: BUNDLE_DIST
  },
  entry: [
    IS_DEV_ENV && 'webpack/hot/poll?1000',
    './src/index'
  ].filter(Boolean),
  resolve: {
    modules: [
      SRC_DIR,
      'node_modules'
    ],
    extensions: [ '.js' ]
  },
  target: 'node',
  watch: IS_DEV_ENV,
  externals: [
    IS_DEV_ENV && nodeExternals({
      whitelist: [
        'webpack/hot/poll?1000'
      ]
    })
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    IS_DEV_ENV && new StartServerPlugin(BUNDLE_DIST),
    IS_DEV_ENV && new webpack.HotModuleReplacementPlugin(),
    IS_DEV_ENV && new webpack.NamedModulesPlugin(),
    IS_PROD_ENV && new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ].filter(Boolean)
};
