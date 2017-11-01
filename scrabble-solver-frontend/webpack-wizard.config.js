const path = require('path');

module.exports = {
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
  env: {
    API_HOST: JSON.stringify(process.env.API_HOST),
    API_PORT: JSON.stringify(process.env.API_PORT),
    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
  },
  input: {
    favicon: path.resolve(__dirname, 'html', 'favicon-v2.ico'),
    html: path.resolve(__dirname, 'html', 'index.html'),
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'src', 'modules'),
      path.resolve(__dirname, '..') //commons parent dir
    ],
  }
};
