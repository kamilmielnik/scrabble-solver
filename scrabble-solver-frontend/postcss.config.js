module.exports = ({ env, options }) => ({
  plugins: {
    autoprefixer: env === 'production' ? options.autoprefixer : false
  }
});
