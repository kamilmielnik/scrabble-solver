import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';

import fetchJson from './fetchJson';

const getDictionary = async (locale: Locale): Promise<Trie> => {
  const serialized = await fetchJson<string>(`/api/dictionary/${locale}`);
  return Trie.deserialize(serialized);
};

export default getDictionary;
