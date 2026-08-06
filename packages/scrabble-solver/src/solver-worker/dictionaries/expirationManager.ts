import { CacheExpiration } from 'workbox-expiration';

import { DICTIONARY_CACHE, DICTIONARY_CACHE_MAX_AGE } from './constants';

export const expirationManager = new CacheExpiration(DICTIONARY_CACHE, {
  maxAgeSeconds: DICTIONARY_CACHE_MAX_AGE / 1000,
});
