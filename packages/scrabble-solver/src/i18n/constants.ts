import { COMMA_ARABIC, COMMA_LATIN } from '@scrabble-solver/constants';
import { Locale } from '@scrabble-solver/types';
import { type FunctionComponent, type SVGAttributes } from 'react';

import { FlagDe, FlagEs, FlagFa, FlagFr, FlagGb, FlagPl, FlagRo, FlagTr, FlagUs } from 'icons';

interface LocaleFeatures {
  comma: string;
  consonants: boolean;
  direction: 'ltr' | 'rtl';
  Icon: FunctionComponent<SVGAttributes<SVGElement>>;
  label: string;
  locale: Locale;
  name: string;
  separator: string;
  vowels: boolean;
}

export const LOCALE_FEATURES: Record<Locale, LocaleFeatures> = {
  [Locale.DE_DE]: {
    comma: COMMA_LATIN,
    consonants: true,
    direction: 'ltr',
    Icon: FlagDe,
    label: 'Deutsch',
    locale: Locale.DE_DE,
    name: 'German',
    separator: `${COMMA_LATIN} `,
    vowels: true,
  },
  [Locale.EN_GB]: {
    comma: COMMA_LATIN,
    consonants: true,
    direction: 'ltr',
    Icon: FlagGb,
    label: 'English (GB)',
    locale: Locale.EN_GB,
    name: 'English (GB)',
    separator: `${COMMA_LATIN} `,
    vowels: true,
  },
  [Locale.EN_US]: {
    comma: COMMA_LATIN,
    consonants: true,
    direction: 'ltr',
    Icon: FlagUs,
    label: 'English (US)',
    locale: Locale.EN_US,
    name: 'English (US)',
    separator: `${COMMA_LATIN} `,
    vowels: true,
  },
  [Locale.ES_ES]: {
    comma: COMMA_LATIN,
    consonants: true,
    direction: 'ltr',
    Icon: FlagEs,
    label: 'Español',
    locale: Locale.ES_ES,
    name: 'Spanish',
    separator: `${COMMA_LATIN} `,
    vowels: true,
  },
  [Locale.FA_IR]: {
    comma: COMMA_ARABIC,
    consonants: false,
    direction: 'rtl',
    Icon: FlagFa,
    label: 'فارسی',
    locale: Locale.FA_IR,
    name: 'Persian',
    separator: `${COMMA_ARABIC} `,
    vowels: false,
  },
  [Locale.FR_FR]: {
    comma: COMMA_LATIN,
    consonants: true,
    direction: 'ltr',
    Icon: FlagFr,
    label: 'Français',
    locale: Locale.FR_FR,
    name: 'French',
    separator: `${COMMA_LATIN} `,
    vowels: true,
  },
  [Locale.PL_PL]: {
    comma: COMMA_LATIN,
    consonants: true,
    direction: 'ltr',
    Icon: FlagPl,
    label: 'Polski',
    locale: Locale.PL_PL,
    name: 'Polish',
    separator: `${COMMA_LATIN} `,
    vowels: true,
  },
  [Locale.RO_RO]: {
    comma: COMMA_LATIN,
    consonants: true,
    direction: 'ltr',
    Icon: FlagRo,
    label: 'Română',
    locale: Locale.RO_RO,
    name: 'Romanian',
    separator: `${COMMA_LATIN} `,
    vowels: true,
  },
  [Locale.TR_TR]: {
    comma: COMMA_LATIN,
    consonants: true,
    direction: 'ltr',
    Icon: FlagTr,
    label: 'Türkçe',
    locale: Locale.TR_TR,
    name: 'Turkish',
    separator: `${COMMA_LATIN} `,
    vowels: true,
  },
};
