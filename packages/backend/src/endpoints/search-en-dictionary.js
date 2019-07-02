import http from 'http';
import { URLSearchParams } from 'url';
import { WordDefinition, NullWordDefinition } from '@scrabble-solver/models';

const API_KEY = 'd0c21cb3cbc3415984a2a0486da075e54aa68091c33a680d9';
const SEARCH_PARAMS = new URLSearchParams({
  api_key: API_KEY, // eslint-disable-line camelcase
  limit: 10,
  sourceDictionaries: 'all'
});

export default async (request, response) => {
  try {
    const { word } = request.params;
    const results = await getJson({
      hostname: 'api.wordnik.com',
      path: `/v4/word.json/${word}/definitions?${SEARCH_PARAMS}`,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
    const wordDefinition = new WordDefinition({
      definitions: results.map(({ text }) => text).filter(Boolean),
      isAllowed: results.length > 0,
      word
    });
    response.send(wordDefinition.toJson());
  } catch (error) {
    response.send(NullWordDefinition);
  }
};

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
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(error);
          }
        });
      })
      .on('error', reject)
  );
