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
import Trie from '../backend/src/solver/trie';

const { argv } = yargs
  .usage('$0 --output=[string] --url=[string] --filename=[string]')
  .option('output', {
    demandOption: false,
    default: 'dictionary.json',
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

const prepareDictionary = () => fetchZipUrl(argv.url)
  .then((zipUrl) => {
    const zipFilename = getFilenameFromUrl(zipUrl);
    return downloadFile(zipUrl, zipFilename)
      .then(() => unzipFile(zipFilename, argv.filename, argv.filename))
      .then(() => removeFile(zipFilename))
      .then(() => writeFile(argv.output, prepareFile(readFile(argv.filename))))
      .then(() => removeFile(argv.filename));
  });

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
  let json = null;
  logAction('Preparing file', () => {
    const words = file.replace(/\r/g, '').split('\n');
    const trie = new Trie(words);
    json = trie.toJson();
  });
  return json;
};

prepareDictionary();
