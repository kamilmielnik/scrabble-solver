import { Locale } from '@scrabble-solver/types';

import { english, french, german, persian, polish, romanian, spanish, turkish } from './languages';

const crawlPerLocale: Record<Locale, (word: string) => Promise<string>> = {
  [Locale.DE_DE]: german.crawl,
  [Locale.EN_GB]: english.crawl,
  [Locale.EN_US]: english.crawl,
  [Locale.ES_ES]: spanish.crawl,
  [Locale.FA_IR]: persian.crawl,
  [Locale.FR_FR]: french.crawl,
  [Locale.PL_PL]: polish.crawl,
  [Locale.RO_RO]: romanian.crawl,
  [Locale.TR_TR]: turkish.crawl,
};

export const crawl = (locale: Locale, word: string): Promise<string> => {
  return crawlPerLocale[locale](word);
};
