import cheerio from 'cheerio';
import decompress from 'decompress';
import { fs } from 'memfs';
import { URL } from 'url';

import { downloadFile, downloadHtml, extractWords } from './lib';

const PAGE_URL = 'https://sjp.pl/slownik/growy/';
const FILE_TO_EXTRACT_FROM_ZIP = 'slowa.txt';
const TEMP_FILENAME = 'tmp.zip';

const getPlPlWordList = async (): Promise<string[]> => {
  const zipUrl = await fetchZipUrl(PAGE_URL);
  await downloadFile(zipUrl, fs.createWriteStream(TEMP_FILENAME));
  await decompress(TEMP_FILENAME, '.', {
    filter: (file) => file.path === FILE_TO_EXTRACT_FROM_ZIP,
  });
  fs.unlinkSync(TEMP_FILENAME);
  const file = fs.readFileSync(FILE_TO_EXTRACT_FROM_ZIP, 'utf-8');
  fs.unlinkSync(FILE_TO_EXTRACT_FROM_ZIP);
  const words = extractWords(file.toString());
  return words;
};

const fetchZipUrl = async (url: string): Promise<string> => {
  const html = await downloadHtml(url);
  const filename = await parseZipContainingPage(html);
  const { href } = new URL(filename, url);
  return href;
};

const parseZipContainingPage = (html: string): string => {
  const $ = cheerio.load(html);
  const $links = $('a');
  const links = Array.from($links)
    .map((link) => $(link).attr('href'))
    .filter(Boolean) as string[];
  const zipFilename = links.find((link) => link.endsWith('.zip'));

  if (typeof zipFilename === 'undefined') {
    throw new Error('Cannot find link to zip file on the page');
  }

  return zipFilename;
};

export default getPlPlWordList;
