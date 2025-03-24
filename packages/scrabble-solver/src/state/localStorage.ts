import { Board, Game, Locale, ShowCoordinates } from '@scrabble-solver/types';
import store2 from 'store2';

import { AutoGroupTiles, InputMode, Rack } from 'types';

const AUTO_GROUP_TILES = 'auto-group-tiles';
const BOARD = 'board';
const GAME_ID = 'config-id';
const INPUT_MODE = 'input-mode';
const LOCALE = 'locale';
const RACK = 'rack';
const SHOW_COORDINATES = 'show-coordinates';

const store = store2.namespace('scrabble-solver');

export const localStorage = {
  getAutoGroupTiles(): AutoGroupTiles | undefined {
    return store.get(AUTO_GROUP_TILES);
  },

  setAutoGroupTiles(autoGroupTiles: AutoGroupTiles | undefined): void {
    store.set(AUTO_GROUP_TILES, autoGroupTiles, true);
  },

  getBoard(): Board | undefined {
    const serialized = store.get(BOARD);
    return serialized ? Board.fromJson(JSON.parse(serialized)) : serialized;
  },

  setBoard(board: Board | undefined): void {
    const serialized = board ? JSON.stringify(board.toJson()) : board;
    store.set(BOARD, serialized, true);
  },

  getGame(): Game | undefined {
    return store.get(GAME_ID);
  },

  setGame(game: Game | undefined): void {
    store.set(GAME_ID, game, true);
  },

  getInputMode(): InputMode | undefined {
    return store.get(INPUT_MODE);
  },

  setInputMode(inputMode: InputMode | undefined): void {
    store.set(INPUT_MODE, inputMode, true);
  },

  getLocale(): Locale | undefined {
    return store.get(LOCALE);
  },

  setLocale(locale: Locale | undefined): void {
    store.set(LOCALE, locale, true);
  },

  getRack(): Rack | undefined {
    return store.get(RACK);
  },

  setRack(rack: Rack | undefined): void {
    store.set(RACK, rack, true);
  },

  getShowCoordinates(): ShowCoordinates | undefined {
    return store.get(SHOW_COORDINATES);
  },

  setShowCoordinates(showCoordinates: ShowCoordinates | undefined): void {
    store.set(SHOW_COORDINATES, showCoordinates, true);
  },
};
