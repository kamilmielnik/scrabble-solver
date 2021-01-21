import { Locale } from '@scrabble-solver/types';

import { flagFr, flagGb, flagPl, flagUs } from 'icons';

import styles from './LocaleSetting.module.scss';

interface Option {
  className: string;
  icon: BrowserSpriteSymbol;
  label: string;
  value: Locale;
}

const options: Option[] = [
  {
    className: styles.gb,
    icon: flagGb,
    label: 'English (GB)',
    value: Locale.EN_GB,
  },
  {
    className: styles.us,
    icon: flagUs,
    label: 'English (US)',
    value: Locale.EN_US,
  },
  {
    className: styles.fr,
    icon: flagFr,
    label: 'Français',
    value: Locale.FR_FR,
  },
  {
    className: styles.pl,
    icon: flagPl,
    label: 'Polski',
    value: Locale.PL_PL,
  },
];

export default options;
