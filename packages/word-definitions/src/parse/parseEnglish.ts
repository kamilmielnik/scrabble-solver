import { WordDefinition } from '@scrabble-solver/types';
import cheerio from 'cheerio';

import { normalizeDefinition } from '../lib';

const parseEnglish = (html: string, word: string): WordDefinition => {
  const $ = cheerio.load(html);
  $('[id^=dictionary-entry]').find('.dtText *').remove();
  const $definitions = $('[id^=dictionary-entry]').find('.dtText, .cxl-ref');
  const wordDefinition = new WordDefinition({
    definitions: Array.from(
      new Set(
        Array.from($definitions)
          .map((definition) => $(definition).text())
          .map(normalizeDefinition)
          .filter(Boolean),
      ),
    ),
    isAllowed: $definitions.length > 0,
    word,
  });
  return wordDefinition;
};

export default parseEnglish;
