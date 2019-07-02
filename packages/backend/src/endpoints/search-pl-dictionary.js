import cheerio from 'cheerio';
import proxy from 'express-http-proxy';
import { WordDefinition } from '@scrabble-solver/models';

export default proxy('https://sjp.pl', {
  https: true,
  userResDecorator: (proxyResponse, proxyResponseData) => parseSjpResponse(proxyResponseData.toString('utf8'))
});

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
  return wordDefinition.toJson();
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
