import { Game } from '@scrabble-solver/types';

import { localStorage } from '../localStorage';

import { guessLocale } from './lib';
import type { SettingsState } from './types';

const isTouchScreen = typeof globalThis.matchMedia !== 'undefined' && globalThis.matchMedia('(hover: none)').matches;

export const settingsInitialState: SettingsState = {
  autoGroupTiles: null,
  game: Game.Scrabble,
  inputMode: isTouchScreen ? 'touchscreen' : 'keyboard',
  locale: guessLocale(),
  removeCellFilters: 'always',
  showCoordinates: 'hidden',
  ...localStorage.getSettings(),
};
