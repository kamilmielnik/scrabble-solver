import logger from '@scrabble-solver/logger';
import { WordDefinition } from '@scrabble-solver/types';
import cheerio from 'cheerio';

import normalizeDefinition from './normalizeDefinition';
import request from './request';

const translateFr = async (word: string): Promise<WordDefinition> => {
  try {
    const response = await request({
      protocol: 'https',
      hostname: 'www.cnrtl.fr',
      path: `/definition/${encodeURIComponent(word)}`,
    });
    const wordDefinition = parseCnrtlResponse(response);
    return wordDefinition;
  } catch (error) {
    logger.error('translateFr', {
      error: error.message,
      word,
    });
    throw error;
  }
};

const parseCnrtlResponse = (html: string): WordDefinition => {
  const $ = cheerio.load(html);
  const $definitions = $('.tlf_cdefinition');
  const wordDefinition = new WordDefinition({
    definitions: Array.from(
      new Set(
        Array.from($definitions)
          .map((definition) => $(definition).text())
          .map(normalizeDefinition)
          .filter(Boolean),
      ),
    ),
    isAllowed: $('#vitemselected span').length > 0,
    word: $('#query').val().trim(),
  });
  return wordDefinition;
};

export default translateFr;
