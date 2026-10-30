/* Preloaded with `node --require` so that the bin scripts build dictionaries without downloading anything. */
const Module = require('module');

const loadModule = Module._load;

Module._load = function load(request, ...rest) {
  return request === '@scrabble-solver/word-lists' ? { getWordList } : loadModule.call(this, request, ...rest);
};

function getWordList(locale) {
  if (locale === process.env.FAILING_LOCALE) {
    return Promise.reject(new Error(`stubbed download failure: ${locale}`));
  }

  return Promise.resolve(['stubbed']);
}
