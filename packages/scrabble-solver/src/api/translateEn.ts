import logger from '@scrabble-solver/logger';
import { WordDefinition } from '@scrabble-solver/models';
import { URLSearchParams } from 'url';

import request from './request';

const API_KEY = 'd0c21cb3cbc3415984a2a0486da075e54aa68091c33a680d9';

const SEARCH_PARAMS = new URLSearchParams({
  api_key: API_KEY, // eslint-disable-line camelcase
  limit: '10',
  sourceDictionaries: 'all',
});

const translateEn = async (word: string): Promise<WordDefinition> => {
  try {
    const response = await request({
      protocol: 'http',
      hostname: 'api.wordnik.com',
      path: `/v4/word.json/${word}/definitions?${SEARCH_PARAMS}`,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
    const results = JSON.parse(response);
    const wordDefinition = new WordDefinition({
      definitions: results.map(({ text }) => text).filter(Boolean),
      isAllowed: results.length > 0,
      word,
    });
    return wordDefinition;
  } catch (error) {
    logger.error('translateEn', {
      error: error.message,
      word,
    });
    return WordDefinition.Null;
  }
};

export default translateEn;
