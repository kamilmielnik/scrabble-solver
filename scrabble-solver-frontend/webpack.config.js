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

const postcssOptions = {
  config: {
    ctx: {
      autoprefixer: {
        browsers: [
          '> 0.1%'
        ]
      }
    }
  }
};

const extractSass = (config) => {
  if (IS_DEV_ENV) {
    return [
      {
        loader: config.fallback
      },
      ...config.use
    ];
  }

  return ExtractTextPlugin.extract(config);
};

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
        use: extractSass({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            },
            {
              loader: 'postcss-loader',
              options: postcssOptions
            }
          ]
        })
      },
      {
        test: /\.scss$/,
        use: extractSass({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                camelCase: true,
                localIdentName: '[local]-[hash:base64:5]',
                minimize: IS_PROD_ENV,
                modules: true
              }
            },
            {
              loader: 'postcss-loader',
              options: postcssOptions
            },
            {
              loader: 'resolve-url-loader'
            },
            {
              loader: 'sass-loader',
              options: {
                data: '@import \'globals.scss\';',
                includePaths: [
                  STYLES_DIR
                ],
                sourceMap: false
              }
            }
          ]
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
    })
  ]
};

if (IS_PROD_ENV) {
  config.plugins.push(
    new ExtractTextPlugin({
      allChunks: true,
      filename: CSS_DIST,
      ignoreOrder: true
    }),
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

if (IS_DEV_ENV) {
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
