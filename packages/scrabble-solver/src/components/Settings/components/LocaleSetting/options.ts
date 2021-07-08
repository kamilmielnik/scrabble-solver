import { Locale } from '@scrabble-solver/types';

import { FlagFr, FlagGb, FlagPl, FlagUs } from 'icons';

import styles from './LocaleSetting.module.scss';

interface Option {
  className: string;
  Icon: SvgComponent;
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
    className: styles.fr,
    Icon: FlagFr,
    label: 'Français',
    value: Locale.FR_FR,
  },
  {
    className: styles.pl,
    Icon: FlagPl,
    label: 'Polski',
    value: Locale.PL_PL,
  },
];

export default options;
