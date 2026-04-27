import { plugin } from 'bun';

plugin({
  name: 'scss-mock',
  setup(build) {
    build.onLoad({ filter: /\.scss$/ }, () => ({
      contents: `
        const proxy = new Proxy({}, {
          get(_, key) {
            if (typeof key === 'symbol') return undefined;
            if (key === 'default') return proxy;
            if (key === '__esModule') return true;
            return key;
          },
        });
        export default proxy;
      `,
      loader: 'js',
    }));
  },
});
