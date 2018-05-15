module.exports = (webpackWizard, { resolveCwdPath }) => {
  const webpackConfig = webpackWizard({
    input: {
      favicon: resolveCwdPath('html/favicon-v2.ico'),
      html: resolveCwdPath('html/index.html'),
      modules: [
        resolveCwdPath('src'),
        resolveCwdPath('src/modules'),
        resolveCwdPath('../scrabble-solver-commons')
      ]
    }
  });

  return webpackConfig;
};
