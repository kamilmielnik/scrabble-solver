import { Trie } from '@kamilmielnik/trie';
import logger from '@scrabble-solver/logger';
import { Locale } from '@scrabble-solver/types';
import { getWordList } from '@scrabble-solver/word-lists';

const downloadDictionary = async (locale: Locale): Promise<Trie> => {
  logger.info('downloadDictionary', { locale });
  const words = await getWordList(locale);
  logger.info('downloadDictionary - success', { locale });
  const trie = Trie.fromArray(words);
  return trie;
};

export default downloadDictionary;
