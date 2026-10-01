import { type Game, type Locale, type ShowCoordinates } from '@scrabble-solver/types';

import type { AutoGroupTiles, InputMode, RemoveCellFilters } from '@/types';

export interface SettingsState {
  autoGroupTiles: AutoGroupTiles;
  firstMoveWordMultiplier: boolean;
  game: Game;
  highlightUnreachableCells: boolean;
  inputMode: InputMode;
  locale: Locale;
  showCoordinates: ShowCoordinates;
  removeCellFilters: RemoveCellFilters;
}
