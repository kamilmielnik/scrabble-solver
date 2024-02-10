import { Locale } from '@scrabble-solver/types';

import { english, farsi, french, german, polish, romanian, spanish } from './languages';

const crawlPerLocale: Record<Locale, (word: string) => Promise<string>> = {
  [Locale.DE_DE]: german.crawl,
  [Locale.EN_GB]: english.crawl,
  [Locale.EN_US]: english.crawl,
  [Locale.ES_ES]: spanish.crawl,
  [Locale.FA_IR]: farsi.crawl,
  [Locale.FR_FR]: french.crawl,
  [Locale.PL_PL]: polish.crawl,
  [Locale.RO_RO]: romanian.crawl,
};

const crawl = (locale: Locale, word: string): Promise<string> => {
  return crawlPerLocale[locale](word);
};

export default crawl;
