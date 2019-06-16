import http from 'http';
import { WordDefinition, NullWordDefinition } from 'scrabble-solver-commons/models';

const API_KEY = 'd0c21cb3cbc3415984a2a0486da075e54aa68091c33a680d9';
const MAX_RESULTS = 10;
const SOURCE_DICTIONARIES = 'all';

export default (request, response) =>
  getJson(getOptions(request.params.word))
    .then((results) => {
      const wordDefinition = new WordDefinition({
        isAllowed: results.length > 0,
        definitions: results.map(({ text }) => text)
      });
      response.send(wordDefinition.toJson());
    })
    .catch(() => response.send(NullWordDefinition));

const getOptions = (word) => ({
  hostname: 'api.wordnik.com',
  path: getWordnikUrl(word),
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
});

const getWordnikUrl = (word) =>
  [
    `/v4/word.json/${word}/definitions?`,
    [`api_key=${API_KEY}`, `limit=${MAX_RESULTS}`, `sourceDictionaries=${SOURCE_DICTIONARIES}`].join('&')
  ].join('');

const getJson = (options) =>
  new Promise((resolve, reject) =>
    http
      .get(options, (response) => {
        let data = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          resolve(JSON.parse(data));
        });
      })
      .on('error', reject)
  );
