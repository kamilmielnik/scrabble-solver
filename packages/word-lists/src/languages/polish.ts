import { load } from 'cheerio';
import fs from 'fs';
import { URL } from 'url';

import { downloadFile, downloadHtml, extractWords, getTempFilepath, unzip } from '../lib';

const PAGE_URL = 'https://sjp.pl/sl/growy/';
const FILE_TO_EXTRACT_FROM_ZIP = 'slowa.txt';

export const getWordList = async (): Promise<string[]> => {
  const tempFilepath = getTempFilepath();
  const zipUrl = await fetchZipUrl(PAGE_URL);
  const zipTempFilename = await downloadFile(zipUrl);
  await unzip(zipTempFilename, FILE_TO_EXTRACT_FROM_ZIP, tempFilepath);
  fs.unlinkSync(zipTempFilename);
  const file = fs.readFileSync(tempFilepath, 'utf-8');
  fs.unlinkSync(tempFilepath);
  const words = extractWords(file.toLocaleString(), 'pl-PL');
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
