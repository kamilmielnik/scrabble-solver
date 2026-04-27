import { plugin } from 'bun';

plugin({
  name: 'scss-mock',
  setup(build) {
    build.onLoad({ filter: /\.scss$/ }, () => ({
      contents: 'module.exports = new Proxy({}, { get: (_, key) => key === "__esModule" ? false : key });',
      loader: 'js',
    }));
  },
});
