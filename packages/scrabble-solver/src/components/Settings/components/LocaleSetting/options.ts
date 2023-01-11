import { Locale } from '@scrabble-solver/types';
import { FunctionComponent, SVGAttributes } from 'react';

import { FlagEs, FlagFa, FlagFr, FlagGb, FlagPl, FlagUs, FlagDe } from 'icons';

import styles from './LocaleSetting.module.scss';

interface Option {
  className: string;
  Icon: FunctionComponent<SVGAttributes<SVGElement>>;
  label: string;
  value: Locale;
}

const options: Option[] = [
  {
    className: styles.gb,
    Icon: FlagGb,
    label: 'English (GB)',
    value: Locale.EN_GB,
  },
  {
    className: styles.us,
    Icon: FlagUs,
    label: 'English (US)',
    value: Locale.EN_US,
  },
  {
    className: styles.fa,
    Icon: FlagFa,
    label: 'فارسی',
    value: Locale.FA_FA,
  },
  {
    className: styles.fr,
    Icon: FlagFr,
    label: 'Français',
    value: Locale.FR_FR,
  },
  {
    className: styles.de,
    Icon: FlagDe,
    label: 'Deutsch',
    value: Locale.DE_DE,
  },
  {
    className: styles.pl,
    Icon: FlagPl,
    label: 'Polski',
    value: Locale.PL_PL,
  },
  {
    className: styles.es,
    Icon: FlagEs,
    label: 'Español',
    value: Locale.ES_ES,
  },
];

export default options;
