module.exports = new Proxy(
  {},
  {
    get: (_, key) => (key === '__esModule' ? false : key),
  },
);
