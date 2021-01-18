const { Trie } = require('@kamilmielnik/trie');
const yargs = require('yargs');

const { createDirectory, downloadFile, logAction, readFile, removeFile, writeFile } = require('./utils');

const { argv } = yargs
  .usage('$0 --output-dir=[string]')
  .option('output-dir', {
    demandOption: false,
    default: 'dictionaries',
    describe: 'output directory',
    type: 'string',
  })
  .help();

const prepareDictionary = async ({ locale, url }) => {
  const outputFile = `${argv.outputDir}/${locale}.txt`;
  const tempFile = `${locale}.txt`;
  await downloadFile(url, tempFile);
  const file = readFile(tempFile);
  const preparedFile = prepareFile(file);
  createDirectory(argv.outputDir);
  writeFile(outputFile, preparedFile);
  removeFile(tempFile);
};

const prepareFile = (file) => {
  let serialized = null;
  logAction('Preparing file', () => {
    // normalization from : https://stackoverflow.com/a/37511463
    const lines = file.replace(/\r/g, '').split('\n').map((w)=> w.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
    const words = lines.filter(Boolean);
    const trie = Trie.fromArray(words);
    serialized = trie.serialize();
  });
  return serialized;
};

const locales = [
  {
    locale: 'fr-FR',
    url: 'https://raw.githubusercontent.com/hbenbel/French-Dictionary/master/dictionary/dictionary.txt',
  },
];

locales.forEach(prepareDictionary);
