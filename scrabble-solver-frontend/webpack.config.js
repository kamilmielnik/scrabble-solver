const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const IS_DEV_ENV = process.env.NODE_ENV === 'development';
const IS_PROD_ENV = process.env.NODE_ENV === 'production';

const SRC_DIR = path.resolve(__dirname, 'src');
const MODULES_DIR = path.resolve(SRC_DIR, 'modules');
const COMMONS_PARENT_DIR = path.resolve(__dirname, '..');
const STYLES_DIR = path.resolve(__dirname, 'src/styles');
const ENTRY_FILE = path.resolve(SRC_DIR, 'index.js');
const ENTRY_FILE_DEV = path.resolve(SRC_DIR, 'index-dev.js');
const DIST_DIR = path.resolve(__dirname, 'dist');
const BUNDLE_DIST = 'bundle.js';
const CSS_DIST = 'styles.css';

const extractSass = new ExtractTextPlugin({
  filename: CSS_DIST,
  allChunks: true,
  disable: IS_DEV_ENV,
  ignoreOrder: true
});
const sass = ({ use, fallback }) => IS_DEV_ENV ? use : extractSass.extract({ use, fallback });

const config = {
  output: {
    filename: BUNDLE_DIST,
    path: DIST_DIR,
    publicPath: '/'
  },
  entry: ENTRY_FILE,
  resolve: {
    modules: [
      SRC_DIR,
      MODULES_DIR,
      COMMONS_PARENT_DIR,
      'node_modules'
    ],
    extensions: [ '.js', '.scss', '.css' ]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: sass({
          use: [
            IS_DEV_ENV && {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            },
            {
              loader: 'postcss-loader'
            }
          ].filter(Boolean),
          fallback: 'style-loader'
        })
      },
      {
        test: /\.scss$/,
        use: sass({
          use: [
            IS_DEV_ENV && {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                camelCase: true,
                minimize: true,
                modules: true,
                localIdentName: '[local]-[hash:base64:5]'
              }
            },
            {
              loader: 'sass-loader',
              options: {
                data: '@import "globals.scss";',
                includePaths: [ STYLES_DIR ],
                sourceMap: false,
                outputStyle: 'expanded'
              }
            },
            {
              loader: 'postcss-loader'
            }
          ].filter(Boolean),
          fallback: 'style-loader'
        })
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        API_HOST: JSON.stringify(process.env.API_HOST),
        API_PORT: JSON.stringify(process.env.API_PORT)
      }
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: true,
      hash: true,
      files: {
        css: [ CSS_DIST ],
        js: [ BUNDLE_DIST ]
      }
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          require('postcss-modules')({
            scopeBehaviour: 'local'
          }),
          autoprefixer({
            browsers: [ '> 0.1%' ]
          })
        ]
      }
    })
  ]
};

if(IS_PROD_ENV) {
  config.plugins.push(
    extractSass,
    new StyleExtHtmlWebpackPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      mangle: true,
      sourceMap: false
    }),
    new CopyWebpackPlugin([
      {
        from: 'index.html'
      }
    ])
  );
}

if(IS_DEV_ENV) {
  config.devtool = 'eval';
  config.entry = [
    'webpack-hot-middleware/client',
    'react-hot-loader/patch',
    ENTRY_FILE_DEV
  ];

  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  );

  config.devServer = {
    compress: true,
    hot: true,
    noInfo: true,
    open: true,
    port: 8080,
    watchOptions: {
      poll: true
    }
  };
}

module.exports = config;
