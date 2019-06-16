import proxy from 'express-http-proxy';
import cheerio from 'cheerio';
import { WordDefinition } from 'scrabble-solver-commons/models';

const DICTIONARY_URL = 'https://sjp.pl';

export default proxy(DICTIONARY_URL, {
  https: true,
  userResDecorator: (proxyResponse, proxyResponseData) => parseSjpResponse(proxyResponseData.toString('utf8'))
});

const parseSjpResponse = (html) => {
  const $ = cheerio.load(html);
  const $header = $($('h1')[0]);
  const $isAllowed = getIsAllowedNode($header);
  const $definitions = getDefinitionsNode($header);
  const wordDefinition = new WordDefinition({
    definitions: getTrimmedDefinitions($definitions),
    isAllowed: isAllowed($isAllowed)
  });
  return wordDefinition.toJson();
};

const getIsAllowedNode = ($header) => $header.next();
const getDefinitionsNode = ($header) =>
  $header
    .next()
    .next()
    .next()
    .next();
const isAllowed = ($isAllowed) => trim($isAllowed.text()).indexOf('dopuszczalne w grach') >= 0;
const getTrimmedDefinitions = ($definitions) =>
  getDefinitions($definitions)
    .map(trim)
    .filter(Boolean);
const getDefinitions = ($definitions) =>
  $definitions
    .text()
    .trim()
    .split(/\d+\./);
const trim = (text) => text.trim();
