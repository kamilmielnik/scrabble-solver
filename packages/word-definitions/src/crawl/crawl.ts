import { Locale } from '@scrabble-solver/types';

import crawlEnglish from './crawlEnglish';
import crawlFrench from './crawlFrench';
import crawlPolish from './crawlPolish';

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
