import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';

const fetchDictionary = async (locale: Locale): Promise<Trie> => {
  const response = await fetch(`/api/dictionary/${locale}`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const serialized = await response.text();
  const trie = Trie.deserialize(serialized);
  return trie;
};

export default fetchDictionary;
