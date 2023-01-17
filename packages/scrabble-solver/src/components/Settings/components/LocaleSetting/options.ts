import { Locale } from '@scrabble-solver/types';
import { FunctionComponent, SVGAttributes } from 'react';

import { FlagEs, FlagFa, FlagFr, FlagGb, FlagPl, FlagUs, FlagDe } from 'icons';

import styles from './LocaleSetting.module.scss';

interface Option {
  className: string;
  Icon: FunctionComponent<SVGAttributes<SVGElement>>;
  label: string;
  name: string;
  value: Locale;
}

const options: Option[] = [
  {
    className: styles.gb,
    Icon: FlagGb,
    label: 'English (GB)',
    name: 'English (GB)',
    value: Locale.EN_GB,
  },
  {
    className: styles.us,
    Icon: FlagUs,
    label: 'English (US)',
    name: 'English (US)',
    value: Locale.EN_US,
  },
  {
    className: styles.fa,
    Icon: FlagFa,
    label: 'فارسی',
    name: 'Persian',
    value: Locale.FA_IR,
  },
  {
    className: styles.fr,
    Icon: FlagFr,
    label: 'Français',
    name: 'French',
    value: Locale.FR_FR,
  },
  {
    className: styles.de,
    Icon: FlagDe,
    label: 'Deutsch',
    name: 'German',
    value: Locale.DE_DE,
  },
  {
    className: styles.pl,
    Icon: FlagPl,
    label: 'Polski',
    name: 'Polish',
    value: Locale.PL_PL,
  },
  {
    className: styles.es,
    Icon: FlagEs,
    label: 'Español',
    name: 'Spanish',
    value: Locale.ES_ES,
  },
].sort((a, b) => a.name.localeCompare(b.name));

export default options;
