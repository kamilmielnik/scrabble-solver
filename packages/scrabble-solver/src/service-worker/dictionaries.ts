import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';

import fetchDictionary from './fetchDictionary';

const cache: Partial<Record<Locale, Trie | Promise<Trie> | undefined>> = {};

export const getDictionary = (locale: Locale): Trie | undefined => {
  const cached = cache[locale];

  if (cached) {
    if (cached instanceof Promise) {
      return undefined;
    }

    return cached;
  }

  revalidateDictionary(locale);

  return undefined;
};

export const revalidateDictionary = (locale: Locale): Promise<Trie> => {
  const promise = fetchDictionary(locale);
  cache[locale] = promise;
  promise
    .then((trie) => {
      cache[locale] = trie;
    })
    .catch(() => {
      cache[locale] = undefined;
    });
  return promise;
};
