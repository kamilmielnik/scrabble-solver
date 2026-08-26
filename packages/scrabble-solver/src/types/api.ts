import { type BoardJson, type Game, type Locale } from '@scrabble-solver/types';

export interface SolveRequestPayload {
  board: BoardJson;
  characters: string[];
  game: Game;
  locale: Locale;
}

export interface VerifyRequestPayload {
  board: BoardJson;
  game: Game;
  locale: Locale;
}

export interface VisitRequestPayload {
  game: Game;
  locale: Locale;
  referrer: string;
}
