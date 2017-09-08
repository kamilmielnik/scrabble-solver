const webpack = require('webpack');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, 'src');
const DIST_DIR = path.resolve(__dirname, 'dist');

module.exports = {
  output: {
    path: DIST_DIR,
    filename: '[name].js',
    library: 'scrabble-solver-commons',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  entry: {
    configs: './src/configs',
    constants: './src/constants',
    models: './src/models'
  },
  resolve: {
    modules: [
      SRC_DIR,
      'node_modules'
    ],
    extensions: [ '.js' ]
  },
  target: 'node',
  watch: false,
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
    new webpack.optimize.UglifyJsPlugin({
      serialize: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ]
};
