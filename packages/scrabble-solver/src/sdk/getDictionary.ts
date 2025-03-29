import { Trie } from '@kamilmielnik/trie';
import { type Locale } from '@scrabble-solver/types';

import { fetchJson } from './fetchJson';

export const getDictionary = async (locale: Locale): Promise<Trie> => {
  const serialized = await fetchJson<string>(`/api/dictionary/${locale}`);
  return Trie.deserialize(serialized);
};
