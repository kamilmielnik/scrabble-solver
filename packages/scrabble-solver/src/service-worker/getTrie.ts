import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';

import { getDictionary } from './dictionaries';

const cache: Partial<Record<Locale, { trie: Trie; dictionary: string } | undefined>> = {};

const getTrie = async (locale: Locale): Promise<Trie | undefined> => {
  const dictionary = await getDictionary(locale);

  if (typeof dictionary === 'undefined') {
    return undefined;
  }

  const cached = cache[locale];

  if (typeof cached === 'undefined' || cached.dictionary !== dictionary) {
    const trie = Trie.deserialize(dictionary);
    cache[locale] = { dictionary, trie };
    return trie;
  }

  return cached.trie;
};

export default getTrie;
