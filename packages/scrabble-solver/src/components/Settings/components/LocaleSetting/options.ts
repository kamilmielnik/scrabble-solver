import { flagGb, flagPl, flagUs, flagFr } from 'icons';
import { Locale } from 'types';

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
    value: 'en-GB',
  },
  {
    className: styles.us,
    icon: flagUs,
    label: 'English (US)',
    value: 'en-US',
  },
  {
    className: styles.pl,
    icon: flagPl,
    label: 'Polski',
    value: 'pl-PL',
  },
  {
    className: styles.fr,
    icon: flagFr,
    label: 'Français',
    value: 'fr-FR',
  },
];

export default options;
