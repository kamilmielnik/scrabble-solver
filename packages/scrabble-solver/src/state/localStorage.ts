import { Board } from '@scrabble-solver/models';
import store2 from 'store2';

import { Locale } from 'types';

const BOARD = 'board';
const CONFIG_ID = 'configId';
const LOCALE = 'locale';
const TILES = 'tiles';

const store = store2.namespace('scrabble-solver');

const localStorage = {
  get board(): Board | undefined {
    const serialized = store.get(BOARD);
    return serialized ? Board.fromJson(JSON.parse(serialized)) : serialized;
  },

  set board(board: Board | undefined) {
    const serialized = board ? JSON.stringify(board.toJson()) : board;
    store.set(BOARD, serialized, true);
  },

  get configId(): string | undefined {
    return store.get(CONFIG_ID);
  },

  set configId(configId: string | undefined) {
    store.set(CONFIG_ID, configId, true);
  },

  get locale(): Locale | undefined {
    return store.get(LOCALE);
  },

  set locale(locale: Locale | undefined) {
    store.set(LOCALE, locale, true);
  },

  get tiles(): (string | null)[] | undefined {
    return store.get(TILES);
  },

  set tiles(tiles: (string | null)[] | undefined) {
    store.set(TILES, tiles, true);
  },
};

export default localStorage;
