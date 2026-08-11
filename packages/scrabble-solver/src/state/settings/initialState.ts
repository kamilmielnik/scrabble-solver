import { Game, Locale } from '@scrabble-solver/types';

import type { SettingsState } from './types';

/**
 * Deterministic defaults shared by the server render and the client's hydration render.
 */
export const settingsInitialState: SettingsState = {
  autoGroupTiles: null,
  game: Game.Scrabble,
  highlightUnreachableCells: false,
  inputMode: 'keyboard',
  locale: Locale.EN_US,
  removeCellFilters: 'always',
  showCoordinates: 'hidden',
};
