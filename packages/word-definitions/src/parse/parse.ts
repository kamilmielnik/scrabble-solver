import { Locale, WordDefinition } from '@scrabble-solver/types';
import cheerio from 'cheerio';

import { normalizeDefinition } from '../lib';

const parseFrench = (html: string, word: string): WordDefinition => {
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

const parsePolish = (html: string): WordDefinition => {
  const $ = cheerio.load(html);
  const $header = $($('h1')[0]);
  const $word = $header.next().next();
  const $isAllowed = $header.next();
  const $definitions = $header.next().next().next().next();
  const wordDefinition = new WordDefinition({
    definitions: Array.from(
      new Set($definitions.text().trim().split(/\d+\./).map(normalizeDefinition).filter(Boolean)),
    ),
    isAllowed: $isAllowed.text().trim().indexOf('dopuszczalne w grach') >= 0,
    word: $word.text().trim(),
  });
  return wordDefinition;
};

const parsePerLocale: Record<Locale, (html: string, word: string) => WordDefinition> = {
  [Locale.EN_GB]: parseEnglish,
  [Locale.EN_US]: parseEnglish,
  [Locale.FR_FR]: parseFrench,
  [Locale.PL_PL]: parsePolish,
};

const parse = (locale: Locale, html: string, word: string): WordDefinition => {
  return parsePerLocale[locale](html, word);
};

export default parse;
