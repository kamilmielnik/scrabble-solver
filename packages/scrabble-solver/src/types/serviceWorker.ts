import { type Locale, isLocale, isObject } from '@scrabble-solver/types';

const PREFETCH_DICTIONARY = 'PREFETCH_DICTIONARY';

export interface PrefetchDictionaryMessage {
  locale: Locale;
  type: typeof PREFETCH_DICTIONARY;
}

export const createPrefetchDictionaryMessage = (locale: Locale): PrefetchDictionaryMessage => ({
  locale,
  type: PREFETCH_DICTIONARY,
});

export const isPrefetchDictionaryMessage = (value: unknown): value is PrefetchDictionaryMessage => {
  return isObject(value) && value.type === PREFETCH_DICTIONARY && isLocale(value.locale);
};
