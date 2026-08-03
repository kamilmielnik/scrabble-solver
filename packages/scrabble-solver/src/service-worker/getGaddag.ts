import { Gaddag } from '@kamilmielnik/gaddag';
import { type Locale } from '@scrabble-solver/types';

import { getDictionary } from './dictionaries';

/**
 * Returns undefined when there is no cached dictionary or when the cached
 * dictionary cannot be deserialized (it was downloaded by an app version with
 * an incompatible format). Callers fall back to the server and revalidate,
 * which replaces the incompatible cache entry.
 */
export const getGaddag = async (locale: Locale): Promise<Gaddag | undefined> => {
  const dictionary = await getDictionary(locale);

  if (typeof dictionary === 'undefined') {
    return undefined;
  }

  try {
    return Gaddag.deserialize(dictionary);
  } catch {
    return undefined;
  }
};
