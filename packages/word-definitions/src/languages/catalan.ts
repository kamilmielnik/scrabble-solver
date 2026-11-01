import { load } from 'cheerio';

import { request } from '../lib';
import type { ParsingResult } from '../types';

interface SearchPayload {
  query?: {
    search?: { title: string }[];
  };
}

const HOSTNAME = 'ca.wiktionary.org';
const HEADERS = { 'User-Agent': 'scrabble-solver (https://github.com/kamilmielnik/scrabble-solver)' };
const SEARCH_RESULTS_COUNT = 10;

// Every combining mark except the cedilla, which makes "ç" a separate letter.
const STRIPPED_COMBINING_MARKS = /[\u0300-\u0326\u0328-\u036f]/g;

/**
 * Words are stored without accents, like on Scrabble tiles, but Wiktionary titles have them: "canço" is "cançó".
 * One word can stand for many titles ("catorze", "catorzè"), so search for them while reading the page of the word.
 * Only the best match among the top SEARCH_RESULTS_COUNT results is read. A page that fails is left out,
 * and a word rejects only when both its pages fail.
 */
export async function crawl(word: string): Promise<string> {
  const [wordPage, accentedPage] = await Promise.allSettled([crawlPage(word), crawlAccentedPage(word)]);
  const contents = [wordPage, accentedPage]
    .map((page) => (page.status === 'fulfilled' ? page.value : undefined))
    .filter((content) => content !== undefined);

  // No content means the page of the word failed too: checking its status only narrows the type to read its reason.
  if (contents.length === 0 && wordPage.status === 'rejected') {
    throw wordPage.reason;
  }

  return contents.join('\n');
}

export function parse(html: string): ParsingResult {
  const $ = load(html);
  const $sections = $('[id="Català"]').parent('section');
  $sections.find('ol li :is(dl, ol, ul), link, style').remove();
  const definitions = Array.from($sections.find('ol > li')).map((definition) => $(definition).text().trim());

  return {
    definitions,
    exists: definitions.length > 0,
  };
}

async function crawlAccentedPage(word: string): Promise<string | undefined> {
  const title = await findAccentedTitle(word);
  return title === undefined ? undefined : crawlPage(title);
}

async function findAccentedTitle(word: string): Promise<string | undefined> {
  const search = await request({
    protocol: 'https',
    hostname: HOSTNAME,
    path: `/w/api.php?action=query&list=search&format=json&srnamespace=0&srprop=&srlimit=${SEARCH_RESULTS_COUNT}&srsearch=${encodeURIComponent(`intitle:${word}`)}`,
    headers: HEADERS,
  });
  return readTitles(search).find((title) => title !== word && stripAccents(title) === stripAccents(word));
}

function crawlPage(title: string): Promise<string> {
  return request({
    protocol: 'https',
    hostname: HOSTNAME,
    path: `/w/rest.php/v1/page/${encodeURIComponent(title)}/html`,
    headers: HEADERS,
  });
}

function readTitles(json: string): string[] {
  try {
    const { query }: SearchPayload = JSON.parse(json);
    return (query?.search ?? []).map(({ title }) => title);
  } catch {
    return [];
  }
}

function stripAccents(word: string): string {
  return word.normalize('NFD').replace(STRIPPED_COMBINING_MARKS, '').normalize('NFC');
}
