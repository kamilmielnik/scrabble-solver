import { load } from 'cheerio';
import { fs } from 'memfs';
import unzipper from 'unzipper';
import { URL } from 'url';

import { downloadFile, downloadHtml, extractWords, getTempFilename } from './lib';

const PAGE_URL = 'https://sjp.pl/sl/growy/';
const FILE_TO_EXTRACT_FROM_ZIP = 'slowa.txt';

const getPlPlWordList = async (): Promise<string[]> => {
  const tempFilename = getTempFilename();
  const zipUrl = await fetchZipUrl(PAGE_URL);
  const zipTempFilename = await downloadFile(zipUrl);
  await unzip(zipTempFilename, tempFilename);
  fs.unlinkSync(zipTempFilename);
  const file = fs.readFileSync(tempFilename, 'utf-8');
  fs.unlinkSync(tempFilename);
  const words = extractWords(file.toLocaleString());
  return words;
};

const fetchZipUrl = async (url: string): Promise<string> => {
  const html = await downloadHtml(url);
  const filename = await parseZipContainingPage(html);
  const { href } = new URL(filename, url);
  return href;
};

const parseZipContainingPage = (html: string): string => {
  const $ = load(html);
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

const unzip = (zipFilename: string, outputFilename: string): Promise<void> => {
  return fs
    .createReadStream(zipFilename)
    .pipe(unzipper.Parse())
    .on('entry', (entry) => {
      const fileName = entry.path;

      if (fileName === FILE_TO_EXTRACT_FROM_ZIP) {
        entry.pipe(fs.createWriteStream(outputFilename));
      } else {
        entry.autodrain();
      }
    })
    .promise();
};

export default getPlPlWordList;
