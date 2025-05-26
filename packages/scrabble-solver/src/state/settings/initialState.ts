import { Game } from '@scrabble-solver/types';

import { localStorage } from '../localStorage';

import { guessLocale } from './lib';
import type { SettingsState } from './types';

const localStorageAutoGroupTiles = localStorage.getAutoGroupTiles();
const isTouchScreen = typeof globalThis.matchMedia !== 'undefined' && globalThis.matchMedia('(hover: none)').matches;

export const settingsInitialState: SettingsState = {
  autoGroupTiles: typeof localStorageAutoGroupTiles === 'undefined' ? 'left' : localStorageAutoGroupTiles,
  game: localStorage.getGame() ?? Game.Scrabble,
  inputMode: localStorage.getInputMode() ?? (isTouchScreen ? 'touchscreen' : 'keyboard'),
  locale: localStorage.getLocale() ?? guessLocale(),
  showCoordinates: localStorage.getShowCoordinates() ?? 'hidden',
  removeCellFilters: localStorage.getRemoveCellFilters() ?? 'always',
};
