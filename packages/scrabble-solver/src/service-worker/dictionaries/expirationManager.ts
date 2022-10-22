import { CacheExpiration } from 'workbox-expiration';

import { DICTIONARY_CACHE, DICTIONARY_CACHE_MAX_AGE } from './constants';

const expirationManager = new CacheExpiration(DICTIONARY_CACHE, {
  maxAgeSeconds: DICTIONARY_CACHE_MAX_AGE / 1000,
});

export default expirationManager;
