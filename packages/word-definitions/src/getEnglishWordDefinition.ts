import { WordDefinition } from '@scrabble-solver/types';
import cheerio from 'cheerio';

import { normalizeDefinition, request } from './lib';

const getEnglishWordDefinition = async (word: string): Promise<WordDefinition> => {
  const response = await request({
    protocol: 'https',
    hostname: 'dictionary.cambridge.org',
    path: `/dictionary/english/${encodeURIComponent(word)}`,
  });
  const wordDefinition = parseResponse(response, word);
  return wordDefinition;
};

const parseResponse = (html: string, word: string): WordDefinition => {
  const $ = cheerio.load(html);
  $('.dlab, .dgram, .ddomain, .duse, .dx-lab').remove();
  const $definitions = $('.def');
  const wordDefinition = new WordDefinition({
    definitions: Array.from(
      new Set(
        Array.from($definitions)
          .map((definition) => $(definition).text())
          .map(normalizeDefinition)
          .filter(Boolean),
      ),
    ),
    isAllowed: Array.from($('.hw.dhw'))
      .map((heading) => $(heading).text().trim())
      .some((heading) => heading.toLowerCase() === word.toLowerCase()),
    word,
  });
  return wordDefinition;
};

export default getEnglishWordDefinition;
