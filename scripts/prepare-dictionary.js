import { URL } from 'url';
import yargs from 'yargs';
import cheerio from 'cheerio';
import {
  downloadHtml,
  downloadFile,
  getFilenameFromUrl,
  logAction,
  readFile,
  removeFile,
  unzipFile,
  writeFile
} from './utils';
import Trie from '../scrabble-solver-backend/src/solver/trie';

const { argv } = yargs
  .usage('$0 --output=[string] --url=[string] --filename=[string]')
  .option('output', {
    demandOption: false,
    default: 'dictionary.txt',
    describe: 'output file',
    type: 'string'
  })
  .option('url', {
    demandOption: false,
    default: 'https://sjp.pl/slownik/growy/',
    describe: 'url to webpage containing link to .zip with dictionary',
    type: 'string'
  })
  .option('filename', {
    demandOption: false,
    default: 'slowa.txt',
    describe: 'name of file to extract from zip',
    type: 'string'
  })
  .help();

const prepareDictionary = async () => {
  const zipUrl = await fetchZipUrl(argv.url);
  const zipFilename = getFilenameFromUrl(zipUrl);
  await downloadFile(zipUrl, zipFilename);
  await unzipFile(zipFilename, argv.filename);
  removeFile(zipFilename);
  const file = readFile(argv.filename);
  const preparedFile = prepareFile(file);
  writeFile(argv.output, preparedFile);
  writeFile(`dist/${argv.output}`, preparedFile);
  removeFile(argv.filename);
};

const fetchZipUrl = (url) => downloadHtml(url)
  .then(parseZipContainingPage)
  .then((zipFilename) => new URL(zipFilename, url).href);

const parseZipContainingPage = (html) => {
  const $ = cheerio.load(html);
  const $links = $('a');
  const links = Array.from($links).map((link) => $(link).attr('href')).filter(Boolean);
  const zipFilename = links.find((link) => link.endsWith('.zip'));
  return zipFilename;
};

const prepareFile = (file) => {
  let serialized = null;
  logAction('Preparing file', () => {
    const words = file.replace(/\r/g, '').split('\n').filter(Boolean);
    const trie = new Trie(words);
    serialized = trie.serialize();
  });
  return serialized;
};

prepareDictionary();
