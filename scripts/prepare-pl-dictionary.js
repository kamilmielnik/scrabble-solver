import { Trie } from '@kamilmielnik/trie';
import { URL } from 'url';
import yargs from 'yargs';
import cheerio from 'cheerio';
import {
  createDirectory,
  downloadHtml,
  downloadFile,
  getFilenameFromUrl,
  logAction,
  readFile,
  removeFile,
  unzipFile,
  writeFile
} from './utils';

const PAGE_URL = 'https://sjp.pl/slownik/growy/';
const FILE_TO_EXTRACT_FROM_ZIP = 'slowa.txt';

const { argv } = yargs
  .usage('$0 --output-dir=[string]')
  .option('output-dir', {
    demandOption: false,
    default: 'dictionaries',
    describe: 'output directory',
    type: 'string'
  })
  .help();

const outputFile = `${argv.outputDir}/pl-PL.txt`;

const prepareDictionary = async () => {
  const zipUrl = await fetchZipUrl(PAGE_URL);
  const zipFilename = getFilenameFromUrl(zipUrl);
  await downloadFile(zipUrl, zipFilename);
  await unzipFile(zipFilename, FILE_TO_EXTRACT_FROM_ZIP);
  removeFile(zipFilename);
  const file = readFile(FILE_TO_EXTRACT_FROM_ZIP);
  const preparedFile = prepareFile(file);
  createDirectory(argv.outputDir);
  createDirectory('dist');
  createDirectory(`dist/${argv.outputDir}`);
  writeFile(outputFile, preparedFile);
  writeFile(`dist/${outputFile}`, preparedFile);
  removeFile(FILE_TO_EXTRACT_FROM_ZIP);
};

const fetchZipUrl = (url) =>
  downloadHtml(url)
    .then(parseZipContainingPage)
    .then((zipFilename) => new URL(zipFilename, url).href);

const parseZipContainingPage = (html) => {
  const $ = cheerio.load(html);
  const $links = $('a');
  const links = Array.from($links)
    .map((link) => $(link).attr('href'))
    .filter(Boolean);
  const zipFilename = links.find((link) => link.endsWith('.zip'));
  return zipFilename;
};

const prepareFile = (file) => {
  let serialized = null;
  logAction('Preparing file', () => {
    const lines = file.replace(/\r/g, '').split('\n');
    const words = lines.filter(Boolean);
    const trie = Trie.fromArray(words);
    serialized = trie.serialize();
  });
  return serialized;
};

prepareDictionary();
