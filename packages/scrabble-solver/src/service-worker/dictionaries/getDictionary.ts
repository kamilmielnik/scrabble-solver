import { Locale } from '@scrabble-solver/types';

import { DICTIONARY_CACHE } from './constants';
import expirationManager from './expirationManager';
import revalidateDictionary from './revalidateDictionary';

const getDictionary = async (locale: Locale): Promise<string | undefined> => {
  await expirationManager.expireEntries();

  const url = `/api/dictionary/${locale}`;
  const cache = await caches.open(DICTIONARY_CACHE);
  const cached = await cache.match(url);

  if (typeof cached === 'undefined') {
    revalidateDictionary(url);
    return undefined;
  }

  const serialized = await cached.clone().text();
  return serialized;
};

export default getDictionary;
