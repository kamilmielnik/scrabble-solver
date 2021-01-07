import logger from '@scrabble-solver/logger';
import { WordDefinition } from '@scrabble-solver/models';
import cheerio from 'cheerio';

import normalizeDefinition from './normalizeDefinition';
import request from './request';

const translatePl = async (word: string): Promise<WordDefinition> => {
  try {
    const response = await request({
      protocol: 'https',
      hostname: 'sjp.pl',
      path: `/${encodeURIComponent(word)}`,
    });
    const wordDefinition = parseSjpResponse(response);
    return wordDefinition;
  } catch (error) {
    logger.error('translatePl', {
      error: error.message,
      word,
    });
    throw error;
  }
};

const parseSjpResponse = (html: string): WordDefinition => {
  const $ = cheerio.load(html);
  const $header = $($('h1')[0]);
  const $word = $header.next().next();
  const $isAllowed = $header.next();
  const $definitions = $header.next().next().next().next();
  const wordDefinition = new WordDefinition({
    definitions: $definitions
      .text()
      .trim()
      .split(/\d+\./)
      .map(normalizeDefinition)
      .map((text) => text.trim())
      .filter(Boolean),
    isAllowed: $isAllowed.text().trim().indexOf('dopuszczalne w grach') >= 0,
    word: $word.text().trim(),
  });
  return wordDefinition;
};

export default translatePl;
