export const DICTIONARY_CACHE = 'dictionary-api-cache';

export const DAY = 24 * 60 * 60 * 1000;

// Staleness is handled by conditional revalidation; expiration only cleans up
// dictionaries of locales the user no longer plays.
export const DICTIONARY_CACHE_MAX_AGE = 30 * DAY;
