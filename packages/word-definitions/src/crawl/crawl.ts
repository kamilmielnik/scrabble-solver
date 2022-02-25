import { Locale } from '@scrabble-solver/types';

import crawlEnglish from './crawlEnglish';
import crawlFrench from './crawlFrench';
import crawlPolish from './crawlPolish';
import crawlSpanish from './crawlSpanish';
import crawlGerman from './crawlGerman';

const crawlPerLocale: Record<Locale, (word: string) => Promise<string>> = {
  [Locale.EN_GB]: crawlEnglish,
  [Locale.EN_US]: crawlEnglish,
  [Locale.ES_ES]: crawlSpanish,
  [Locale.FR_FR]: crawlFrench,
  [Locale.PL_PL]: crawlPolish,
  [Locale.DE_DE]: crawlGerman,
};

const crawl = (locale: Locale, word: string): Promise<string> => {
  return crawlPerLocale[locale](word);
};

export default crawl;
