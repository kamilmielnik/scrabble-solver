import { Locale } from '@scrabble-solver/types';

interface LocaleFeatures {
  locale: Locale;
  consonants: boolean;
  vowels: boolean;
}

export const LOCALE_FEATURES: Record<Locale, LocaleFeatures> = {
  [Locale.DE_DE]: { locale: Locale.DE_DE, consonants: true, vowels: true },
  [Locale.EN_GB]: { locale: Locale.EN_GB, consonants: true, vowels: true },
  [Locale.EN_US]: { locale: Locale.EN_US, consonants: true, vowels: true },
  [Locale.ES_ES]: { locale: Locale.ES_ES, consonants: true, vowels: true },
  [Locale.FA_IR]: { locale: Locale.FA_IR, consonants: false, vowels: false },
  [Locale.FR_FR]: { locale: Locale.FR_FR, consonants: true, vowels: true },
  [Locale.PL_PL]: { locale: Locale.PL_PL, consonants: true, vowels: true },
};
