const fs = require('fs');

const eslintConfigPath = './.eslintrc.js';
const baseConfig = require(eslintConfigPath);

module.exports = Object.assign({}, baseConfig, {
  extends: baseConfig.extends.filter((config) => config.includes('prettier')),
  rules: {}
});
