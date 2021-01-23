import { Trie } from '@kamilmielnik/trie';
import { Locale } from '@scrabble-solver/types';

import Cache from './Cache';
import createDownloadDictionaryProxy from './createDownloadDictionaryProxy';

const createDownloadDictionaryProxies = (cache: Cache<Locale, Trie>): Record<Locale, () => Promise<Trie>> => {
  const locales = Object.values(Locale);
  const entries = locales.map((locale) => [locale, createDownloadDictionaryProxy(cache, locale)]);
  const downloadDictionaryProxies = Object.fromEntries(entries);
  return downloadDictionaryProxies;
};

export default createDownloadDictionaryProxies;
