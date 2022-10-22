import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';

import fetchDictionary from './fetchDictionary';

const cache: Partial<Record<Locale, { trie: Trie; dictionary: string } | undefined>> = {};

const getTrie = async (locale: Locale): Promise<Trie | undefined> => {
  const dictionary = await fetchDictionary(locale);
  const cached = cache[locale];

  if (typeof cached === 'undefined' || cached.dictionary !== dictionary) {
    const trie = Trie.deserialize(dictionary);
    cache[locale] = { dictionary, trie };
    return trie;
  }

  return cached.trie;
};

export default getTrie;
