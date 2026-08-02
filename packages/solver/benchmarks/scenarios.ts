import { Locale } from '@scrabble-solver/types';

export interface LanguageScenario {
  baseRack: string[];
  boardRows: string[];
  boardWords: string[];
  label: string;
  locale: Locale;
}

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

const ENGLISH_BOARD_WORDS = ['axe', 'cozy', 'flames', 'oaf', 'ratio', 'raven', 'stone', 'taxi', 'verge'];

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

const POLISH_BOARD_WORDS = ['etos', 'kier', 'korale', 'mysz', 'rak', 'smak', 'tor', 'war', 'wino'];

const POLISH_BASE_RACK = ['a', 'e', 'i', 'n', 'o', 'r', 's'];

export const LANGUAGE_SCENARIOS: LanguageScenario[] = [
  {
    baseRack: ENGLISH_BASE_RACK,
    boardRows: ENGLISH_BOARD_ROWS,
    boardWords: ENGLISH_BOARD_WORDS,
    label: 'English (US)',
    locale: Locale.EN_US,
  },
  {
    baseRack: ENGLISH_BASE_RACK,
    boardRows: ENGLISH_BOARD_ROWS,
    boardWords: ENGLISH_BOARD_WORDS,
    label: 'English (GB)',
    locale: Locale.EN_GB,
  },
  {
    baseRack: POLISH_BASE_RACK,
    boardRows: POLISH_BOARD_ROWS,
    boardWords: POLISH_BOARD_WORDS,
    label: 'Polish',
    locale: Locale.PL_PL,
  },
];
