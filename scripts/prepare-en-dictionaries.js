import yargs from 'yargs';
import {
  createDirectory,
  downloadFile,
  logAction,
  readFile,
  removeFile,
  writeFile
} from './utils';
import Trie from '../scrabble-solver-backend/src/solver/trie';

const { argv } = yargs
  .usage('$0 --output-dir=[string]')
  .option('output-dir', {
    demandOption: false,
    default: 'dictionaries',
    describe: 'output directory',
    type: 'string'
  })
  .help();

const FIRST_WORD = 'aa';

const prepareDictionary = async ({ locale, url }) => {
  const outputFile = `${argv.outputDir}/${locale}.txt`;
  const tempFile = `${locale}.txt`;
  await downloadFile(url, tempFile);
  const file = readFile(tempFile);
  const preparedFile = prepareFile(file);
  createDirectory(argv.outputDir);
  createDirectory('dist');
  createDirectory(`dist/${argv.outputDir}`);
  writeFile(outputFile, preparedFile);
  writeFile(`dist/${outputFile}`, preparedFile);
  removeFile(tempFile);
};

const prepareFile = (file) => {
  let serialized = null;
  logAction('Preparing file', () => {
    const lines = file.replace(/\r/g, '').split('\n');
    const firstWordIndex = lines.indexOf(FIRST_WORD);
    const words = lines.slice(firstWordIndex).filter(Boolean);
    const trie = new Trie(words);
    serialized = trie.serialize();
  });
  return serialized;
};

const locales = [
  {
    locale: 'en-GB',
    url: 'https://www.wordgamedictionary.com/sowpods/download/sowpods.txt'
  },
  {
    locale: 'en-US',
    url: 'https://www.wordgamedictionary.com/twl06/download/twl06.txt'
  }
];

locales.forEach(prepareDictionary);
