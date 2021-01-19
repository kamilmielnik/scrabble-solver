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
    label: 'English',
    value: Locale.enGb,
  },
  {
    className: styles.us,
    icon: flagUs,
    label: 'English',
    value: Locale.enUs,
  },
  {
    className: styles.pl,
    icon: flagPl,
    label: 'Polski',
    value: Locale.plPl,
  },
  {
    className: styles.fr,
    icon: flagFr,
    label: 'Français',
    value: Locale.frFr,
  },
];

export default options;
