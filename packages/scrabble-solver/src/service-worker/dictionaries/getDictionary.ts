import { type Locale } from '@scrabble-solver/types';

import { DICTIONARY_CACHE } from './constants';
import { expirationManager } from './expirationManager';
import { getDictionaryUrl } from './getDictionaryUrl';

export const getDictionary = async (locale: Locale): Promise<Response | undefined> => {
  await expirationManager.expireEntries();

  const cache = await caches.open(DICTIONARY_CACHE);
  return cache.match(getDictionaryUrl(locale));
};
