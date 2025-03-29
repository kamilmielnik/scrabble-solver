const POLISH_DICTIONARY_AVERAGE_DOWNLOAD_DURATION = 90_000;

// Dictionaries used in tests are downloaded on demand (if not cached)
// and on average it takes 90 seconds to get the Polish dictionary downloaded.
// Doubling that amount should be safe enough.
jest.setTimeout(2 * POLISH_DICTIONARY_AVERAGE_DOWNLOAD_DURATION);
