import classNames from 'classnames';
import { flagGb, flagPl, flagUs } from 'icons';
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
    className: classNames(styles.flag, styles.gb),
    icon: flagGb,
    label: 'English (GB)',
    value: 'en-GB',
  },
  {
    className: classNames(styles.flag, styles.us),
    icon: flagUs,
    label: 'English (US)',
    value: 'en-US',
  },
  {
    className: classNames(styles.flag, styles.pl),
    icon: flagPl,
    label: 'Polski',
    value: 'pl-PL',
  },
];

export default options;
