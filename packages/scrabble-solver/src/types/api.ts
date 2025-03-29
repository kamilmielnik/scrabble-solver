import { type BoardJson, type ConfigJson, type Game, type Locale } from '@scrabble-solver/types';

export interface SolveRequestPayload {
  board: BoardJson;
  characters: string[];
  config: ConfigJson;
  game: Game;
  locale: Locale;
}

export interface VerifyRequestPayload {
  board: BoardJson;
  game: Game;
  locale: Locale;
}
