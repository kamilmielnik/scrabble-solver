import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';

interface Cache {
  get(locale: Locale): Promise<Trie | undefined>;
  has(locale: Locale): boolean;
  isStale(locale: Locale): boolean;
  set(locale: Locale, trie: Trie): Promise<void>;
}

export default Cache;
