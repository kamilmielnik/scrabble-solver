const { Trie } = require('@kamilmielnik/trie');
const fs = require('fs');
const yargs = require('yargs');

const { getEnGbWordList, getEnUsWordList, getFrFrWordList, getPlPlWordList } = require('../packages/word-lists');

const createDirectory = (filepath) => {
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath);
  }
};

const { argv } = yargs
  .usage('$0 --output-dir=[string]')
  .option('output-dir', {
    demandOption: false,
    default: 'dictionaries',
    describe: 'output directory',
    type: 'string',
  })
  .help();

const prepareDictionary = async (locale, getWordList) => {
  createDirectory(argv.outputDir);
  const filename = `${argv.outputDir}/${locale}.txt`;
  const words = await getWordList();
  const trie = Trie.fromArray(words);
  serialized = trie.serialize();
  fs.writeFileSync(filename, serialized);
};

const main = () => {
  prepareDictionary('en-GB', getEnGbWordList);
  prepareDictionary('en-US', getEnUsWordList);
  prepareDictionary('fr-FR', getFrFrWordList);
  prepareDictionary('pl-PL', getPlPlWordList);
};

main();
