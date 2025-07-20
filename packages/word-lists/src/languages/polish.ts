import { Locale } from '@scrabble-solver/types';
import { load } from 'cheerio';
import fs from 'fs';
import { URL } from 'url';

import { downloadFile, downloadHtml, extractWords, getTempFilepath, getTxtWordList, unzip } from '../lib';

const PAGE_URL = 'https://sjp.pl/sl/growy/';
const FILE_TO_EXTRACT_FROM_ZIP = 'slowa.txt';
const REASONABLE_VALID_WORD_COUNT_TRESHOLD = 2_000_000; // more like 3M, but just to be safe
const SECONDARY_FILE_URL =
  'https://raw.githubusercontent.com/kamilmielnik/scrabble-dictionaries/refs/heads/master/polish/sjp.txt';

export const getWordList = async (): Promise<string[]> => {
  try {
    const tempFilepath = getTempFilepath();
    const zipUrl = await fetchZipUrl(PAGE_URL);
    const zipTempFilename = await downloadFile(zipUrl);
    await unzip(zipTempFilename, FILE_TO_EXTRACT_FROM_ZIP, tempFilepath);
    fs.unlinkSync(zipTempFilename);
    const file = fs.readFileSync(tempFilepath, 'utf-8');
    fs.unlinkSync(tempFilepath);
    const words = extractWords(file.toLocaleString(), 'pl-PL');

    if (words.length < REASONABLE_VALID_WORD_COUNT_TRESHOLD) {
      return getBackupWordList();
    }

    return words;
  } catch {
    return getBackupWordList();
  }
};

const fetchZipUrl = async (url: string): Promise<string> => {
  const html = await downloadHtml(url);
  const filename = parseZipContainingPage(html);
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

const getBackupWordList = () => {
  return getTxtWordList(SECONDARY_FILE_URL, Locale.PL_PL);
};
