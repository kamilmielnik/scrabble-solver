import cheerio from 'cheerio';
import { NullWordDefinition, WordDefinition } from '@scrabble-solver/models';

import { request } from './utils';

export default async (word) => {
  try {
    const response = await request({
      protocol: 'https',
      hostname: 'sjp.pl',
      path: `/${word}`
    });
    const wordDefinition = parseSjpResponse(response);
    return wordDefinition;
  } catch (error) {
    return NullWordDefinition;
  }
};

const parseSjpResponse = (html) => {
  const $ = cheerio.load(html);
  const $header = $($('h1')[0]);
  const $word = getWordNode($header);
  const $isAllowed = getIsAllowedNode($header);
  const $definitions = getDefinitionsNode($header);
  const wordDefinition = new WordDefinition({
    definitions: getTrimmedDefinitions($definitions),
    isAllowed: isAllowed($isAllowed),
    word: getWord($word)
  });
  return wordDefinition;
};

const getIsAllowedNode = ($header) => $header.next();

const getWordNode = ($header) => $header.next().next();

const getDefinitionsNode = ($header) =>
  $header
    .next()
    .next()
    .next()
    .next();

const getWord = ($word) => $word.text().trim();

const isAllowed = ($isAllowed) =>
  $isAllowed
    .text()
    .trim()
    .indexOf('dopuszczalne w grach') >= 0;

const getTrimmedDefinitions = ($definitions) =>
  getDefinitions($definitions)
    .map((text) => text.trim())
    .filter(Boolean);

const getDefinitions = ($definitions) =>
  $definitions
    .text()
    .trim()
    .split(/\d+\./);
