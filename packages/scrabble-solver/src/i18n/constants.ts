import { Locale } from '@scrabble-solver/types';
import { FunctionComponent, SVGAttributes } from 'react';

import { FlagDe, FlagEs, FlagFa, FlagFr, FlagGb, FlagPl, FlagUs } from 'icons';

import styles from './i18n.module.scss';

interface LocaleFeatures {
  direction: 'ltr' | 'rtl';
  consonants: boolean;
  vowels: boolean;
}

export const LOCALE_FEATURES: Record<Locale, LocaleFeatures> = {
  [Locale.DE_DE]: {
    direction: 'ltr',
    consonants: true,
    vowels: true,
  },
  [Locale.EN_GB]: {
    direction: 'ltr',
    consonants: true,
    vowels: true,
  },
  [Locale.EN_US]: {
    direction: 'ltr',
    consonants: true,
    vowels: true,
  },
  [Locale.ES_ES]: {
    direction: 'ltr',
    consonants: true,
    vowels: true,
  },
  [Locale.FA_IR]: {
    direction: 'rtl',
    consonants: false,
    vowels: false,
  },
  [Locale.FR_FR]: {
    direction: 'ltr',
    consonants: true,
    vowels: true,
  },
  [Locale.PL_PL]: {
    direction: 'ltr',
    consonants: true,
    vowels: true,
  },
};

interface Flag {
  className: string;
  Icon: FunctionComponent<SVGAttributes<SVGElement>>;
  label: string;
  name: string;
  value: Locale;
}

export const LOCALE_FLAGS: Record<Locale, Flag> = {
  [Locale.DE_DE]: {
    className: styles.de,
    Icon: FlagDe,
    label: 'Deutsch',
    name: 'German',
    value: Locale.DE_DE,
  },
  [Locale.EN_GB]: {
    className: styles.gb,
    Icon: FlagGb,
    label: 'English (GB)',
    name: 'English (GB)',
    value: Locale.EN_GB,
  },
  [Locale.EN_US]: {
    className: styles.us,
    Icon: FlagUs,
    label: 'English (US)',
    name: 'English (US)',
    value: Locale.EN_US,
  },
  [Locale.ES_ES]: {
    className: styles.es,
    Icon: FlagEs,
    label: 'Español',
    name: 'Spanish',
    value: Locale.ES_ES,
  },
  [Locale.FA_IR]: {
    className: styles.fa,
    Icon: FlagFa,
    label: 'فارسی',
    name: 'Persian',
    value: Locale.FA_IR,
  },
  [Locale.FR_FR]: {
    className: styles.fr,
    Icon: FlagFr,
    label: 'Français',
    name: 'French',
    value: Locale.FR_FR,
  },
  [Locale.PL_PL]: {
    className: styles.pl,
    Icon: FlagPl,
    label: 'Polski',
    name: 'Polish',
    value: Locale.PL_PL,
  },
};
