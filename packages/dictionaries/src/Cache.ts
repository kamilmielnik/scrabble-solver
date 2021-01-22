import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';

interface Cache {
  has(locale: Locale): boolean;
  get(locale: Locale): Promise<Trie | undefined>;
  set(locale: Locale, trie: Trie): Promise<void>;
}

export default Cache;
