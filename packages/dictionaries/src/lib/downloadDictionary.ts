import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';
import { getWordList } from '@scrabble-solver/word-lists';

const downloadDictionary = async (locale: Locale): Promise<Trie> => {
  const words = await getWordList(locale);
  const trie = Trie.fromArray(words);
  return trie;
};

export default downloadDictionary;
