import { type Game, type Locale, type ShowCoordinates } from '@scrabble-solver/types';

import type { AutoGroupTiles, InputMode, RemoveCellFilters } from 'types';

export interface SettingsState {
  autoGroupTiles: AutoGroupTiles;
  game: Game;
  inputMode: InputMode;
  locale: Locale;
  showCoordinates: ShowCoordinates;
  removeCellFilters: RemoveCellFilters;
}
