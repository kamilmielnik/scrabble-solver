import { Locale } from '@scrabble-solver/types';

interface LocaleFeatures {
  direction: 'ltr' | 'rtl';
  fontFamily: string;
  consonants: boolean;
  vowels: boolean;
}

export const LOCALE_FEATURES: Record<Locale, LocaleFeatures> = {
  [Locale.DE_DE]: {
    direction: 'ltr',
    fontFamily: 'Open Sans',
    consonants: true,
    vowels: true,
  },
  [Locale.EN_GB]: {
    direction: 'ltr',
    fontFamily: 'Open Sans',
    consonants: true,
    vowels: true,
  },
  [Locale.EN_US]: {
    direction: 'ltr',
    fontFamily: 'Open Sans',
    consonants: true,
    vowels: true,
  },
  [Locale.ES_ES]: {
    direction: 'ltr',
    fontFamily: 'Open Sans',
    consonants: true,
    vowels: true,
  },
  [Locale.FA_IR]: {
    direction: 'rtl',
    fontFamily: 'Vazirmatn',
    consonants: false,
    vowels: false,
  },
  [Locale.FR_FR]: {
    direction: 'ltr',
    fontFamily: 'Open Sans',
    consonants: true,
    vowels: true,
  },
  [Locale.PL_PL]: {
    direction: 'ltr',
    fontFamily: 'Open Sans',
    consonants: true,
    vowels: true,
  },
};
