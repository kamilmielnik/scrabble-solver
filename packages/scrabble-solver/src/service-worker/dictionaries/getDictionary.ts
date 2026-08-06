import { type Locale } from '@scrabble-solver/types';

import { DICTIONARY_CACHE } from './constants';
import { getDictionaryUrl } from './getDictionaryUrl';
import { resetRevalidationThrottle } from './revalidateDictionary';

export const getDictionary = async (locale: Locale): Promise<Response | undefined> => {
  const cache = await caches.open(DICTIONARY_CACHE);
  return cache.match(getDictionaryUrl(locale));
};

export const deleteDictionary = async (locale: Locale): Promise<void> => {
  const cache = await caches.open(DICTIONARY_CACHE);
  await cache.delete(getDictionaryUrl(locale));
  resetRevalidationThrottle(locale);
};
