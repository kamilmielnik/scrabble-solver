import { Gaddag } from '@kamilmielnik/gaddag';
import { logEvent } from '@scrabble-solver/logger';
import { type Locale } from '@scrabble-solver/types';
import { getWordList } from '@scrabble-solver/word-lists';

export async function downloadDictionary(locale: Locale): Promise<Gaddag> {
  const downloadStartedAt = performance.now();
  const words = await getWordList(locale);
  const buildStartedAt = performance.now();
  const gaddag = Gaddag.fromArray(words);

  logEvent({
    type: 'build',
    locale,
    words: words.length,
    download_ms: Math.round(buildStartedAt - downloadStartedAt),
    build_ms: Math.round(performance.now() - buildStartedAt),
  });

  return gaddag;
}
