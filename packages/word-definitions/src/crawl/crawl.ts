import { Locale } from '@scrabble-solver/types';

import crawlEnglish from './crawlEnglish';
import crawlFarsi from './crawlFarsi';
import crawlFrench from './crawlFrench';
import crawlGerman from './crawlGerman';
import crawlPolish from './crawlPolish';
import crawlSpanish from './crawlSpanish';

const crawlPerLocale: Record<Locale, (word: string) => Promise<string>> = {
  [Locale.DE_DE]: crawlGerman,
  [Locale.EN_GB]: crawlEnglish,
  [Locale.EN_US]: crawlEnglish,
  [Locale.ES_ES]: crawlSpanish,
  [Locale.FA_FA]: crawlFarsi,
  [Locale.FR_FR]: crawlFrench,
  [Locale.PL_PL]: crawlPolish,
};

const crawl = (locale: Locale, word: string): Promise<string> => {
  return crawlPerLocale[locale](word);
};

export default crawl;
