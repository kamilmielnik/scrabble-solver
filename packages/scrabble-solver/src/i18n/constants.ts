import { Locale } from '@scrabble-solver/types';

interface LocaleFeatures {
  locale: Locale;
  direction: 'ltr' | 'rtl';
  consonants: boolean;
  vowels: boolean;
}

export const LOCALE_FEATURES: Record<Locale, LocaleFeatures> = {
  [Locale.DE_DE]: { locale: Locale.DE_DE, direction: 'ltr', consonants: true, vowels: true },
  [Locale.EN_GB]: { locale: Locale.EN_GB, direction: 'ltr', consonants: true, vowels: true },
  [Locale.EN_US]: { locale: Locale.EN_US, direction: 'ltr', consonants: true, vowels: true },
  [Locale.ES_ES]: { locale: Locale.ES_ES, direction: 'ltr', consonants: true, vowels: true },
  [Locale.FA_IR]: { locale: Locale.FA_IR, direction: 'rtl', consonants: false, vowels: false },
  [Locale.FR_FR]: { locale: Locale.FR_FR, direction: 'ltr', consonants: true, vowels: true },
  [Locale.PL_PL]: { locale: Locale.PL_PL, direction: 'ltr', consonants: true, vowels: true },
};
