import { Board, Locale } from '@scrabble-solver/types';
import store2 from 'store2';

import { AutoGroupTiles, Rack } from 'types';

const AUTO_GROUP_TILES = 'auto-group-tiles';
const BOARD = 'board';
const CONFIG_ID = 'config-id';
const LOCALE = 'locale';
const RACK = 'rack';

const store = store2.namespace('scrabble-solver');

const localStorage = {
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

  getConfigId(): string | undefined {
    return store.get(CONFIG_ID);
  },

  setConfigId(configId: string | undefined): void {
    store.set(CONFIG_ID, configId, true);
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
};

export default localStorage;
