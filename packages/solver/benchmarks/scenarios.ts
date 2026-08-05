import { Locale } from '@scrabble-solver/types';

import { type LanguageScenario } from './types';

const ENGLISH_BOARD_ROWS = [
  '               ',
  '               ',
  '               ',
  '               ',
  '               ',
  '  cozy         ',
  '   a           ',
  '   flames a    ',
  '        taxi   ',
  '    ratio e    ',
  '    a   n      ',
  '    verge      ',
  '    e          ',
  '    n          ',
  '               ',
];

const ENGLISH_BASE_RACK = ['r', 'e', 't', 'i', 'n', 'a', 's'];

const POLISH_BOARD_ROWS = [
  '               ',
  '               ',
  '               ',
  '               ',
  '   s           ',
  '   mysz        ',
  '   a           ',
  '   korale      ',
  '        tor    ',
  '     wino a    ',
  '     a  s k    ',
  '  kier         ',
  '               ',
  '               ',
  '               ',
];

const POLISH_BASE_RACK = ['a', 'e', 'i', 'n', 'o', 'r', 's'];

export const LANGUAGE_SCENARIOS: LanguageScenario[] = [
  {
    baseRack: ENGLISH_BASE_RACK,
    boardRows: ENGLISH_BOARD_ROWS,
    label: 'English (US)',
    locale: Locale.EN_US,
  },
  {
    baseRack: ENGLISH_BASE_RACK,
    boardRows: ENGLISH_BOARD_ROWS,
    label: 'English (GB)',
    locale: Locale.EN_GB,
  },
  {
    baseRack: POLISH_BASE_RACK,
    boardRows: POLISH_BOARD_ROWS,
    label: 'Polish',
    locale: Locale.PL_PL,
  },
];
