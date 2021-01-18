import logger from '@scrabble-solver/logger';
import { WordDefinition } from '@scrabble-solver/models';
import { URLSearchParams } from 'url';

import normalizeDefinition from './normalizeDefinition';
import request from './request';

// If key is kept secret then `npx scrabble-solver` won't work.
// The only consequence of someone else using the key is overusing it - the free plan has 100 calls per hour.
// Wordnik API keys are free anyway, so there is no good reason to steal a free key.
// Just get it here: https://developer.wordnik.com/
const WORDNIK_API_KEY = 'd0c21cb3cbc3415984a2a0486da075e54aa68091c33a680d9';

const SEARCH_PARAMS = new URLSearchParams({
  api_key: WORDNIK_API_KEY, // eslint-disable-line camelcase
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
    const wordDefinition = parseWordnikResponse(word, response);
    return wordDefinition;
  } catch (error) {
    logger.error('translateEn', {
      error: error.message,
      word,
    });
    throw error;
  }
};

const parseWordnikResponse = (word: string, response: string): WordDefinition => {
  const results: { text: string }[] = JSON.parse(response);

  if (!Array.isArray(results)) {
    const error = new Error('Results is not an array');

    logger.error('translateEn', {
      error: error.message,
      results,
    });

    throw new Error('Results is not an array');
  }

  const wordDefinition = new WordDefinition({
    definitions: Array.from(
      new Set(
        results
          .map(({ text }) => text)
          .map(normalizeDefinition)
          .map((text) => text.trim())
          .filter(Boolean),
      ),
    ),
    isAllowed: results.length > 0,
    word,
  });

  return wordDefinition;
};

export default translateEn;
