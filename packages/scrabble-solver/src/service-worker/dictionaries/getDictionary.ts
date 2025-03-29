import { type Locale } from '@scrabble-solver/types';

import { DICTIONARY_CACHE } from './constants';
import { expirationManager } from './expirationManager';
import { getDictionaryUrl } from './getDictionaryUrl';

export const getDictionary = async (locale: Locale): Promise<string | undefined> => {
  await expirationManager.expireEntries();

  const url = getDictionaryUrl(locale);
  const cache = await caches.open(DICTIONARY_CACHE);
  const cached = await cache.match(url);

  if (typeof cached === 'undefined') {
    return undefined;
  }

  const serialized = await cached.clone().text();
  return serialized;
};
