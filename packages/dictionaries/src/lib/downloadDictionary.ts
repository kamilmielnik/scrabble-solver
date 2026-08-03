import { Gaddag } from '@kamilmielnik/gaddag';
import { logger } from '@scrabble-solver/logger';
import { type Locale } from '@scrabble-solver/types';
import { getWordList } from '@scrabble-solver/word-lists';

export const downloadDictionary = async (locale: Locale): Promise<Gaddag> => {
  logger.info('downloadDictionary', { locale });
  const words = await getWordList(locale);
  logger.info('downloadDictionary - success', { locale });
  const gaddag = Gaddag.fromArray(words);
  logger.info('downloadDictionary - gaddag built', { locale });
  return gaddag;
};
