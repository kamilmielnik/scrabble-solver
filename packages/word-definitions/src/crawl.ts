import { Locale } from '@scrabble-solver/types';

import { request } from './lib';

const crawlFrench = (word: string): Promise<string> => {
  return request({
    protocol: 'https',
    hostname: 'www.cnrtl.fr',
    path: `/definition/${encodeURIComponent(word)}`,
  });
};

const crawlEnglish = (word: string): Promise<string> => {
  return request({
    protocol: 'https',
    hostname: 'www.merriam-webster.com',
    path: `/dictionary/${encodeURIComponent(word)}`,
  });
};

const crawlPolish = (word: string): Promise<string> => {
  return request({
    protocol: 'https',
    hostname: 'sjp.pl',
    path: `/${encodeURIComponent(word)}`,
  });
};

const crawlPerLocale: Record<Locale, (word: string) => Promise<string>> = {
  [Locale.EN_GB]: crawlEnglish,
  [Locale.EN_US]: crawlEnglish,
  [Locale.FR_FR]: crawlFrench,
  [Locale.PL_PL]: crawlPolish,
};

const crawl = (locale: Locale, word: string): Promise<string> => {
  return crawlPerLocale[locale](word);
};

export default crawl;
