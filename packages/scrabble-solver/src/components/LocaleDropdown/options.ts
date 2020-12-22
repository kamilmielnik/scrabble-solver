import { flagGb, flagPl, flagUs } from 'icons';
import { Locale } from 'types';

import styles from './LocaleDropdown.module.scss';

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
];

export default options;
