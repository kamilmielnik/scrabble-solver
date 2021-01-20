import { WordDefinition } from '@scrabble-solver/types';
import cheerio from 'cheerio';

import { normalizeDefinition, request } from './lib';

const getFrenchWordDefinition = async (word: string): Promise<WordDefinition> => {
  const response = await request({
    protocol: 'https',
    hostname: 'www.cnrtl.fr',
    path: `/definition/${encodeURIComponent(word)}`,
  });
  const wordDefinition = parseResponse(response, word);
  return wordDefinition;
};

const parseResponse = (html: string, word: string): WordDefinition => {
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
    word,
  });
  return wordDefinition;
};

export default getFrenchWordDefinition;
