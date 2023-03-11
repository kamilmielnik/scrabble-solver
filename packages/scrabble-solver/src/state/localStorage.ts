import { Board, Locale } from '@scrabble-solver/types';
import store2 from 'store2';

const BOARD = 'board';
const CONFIG_ID = 'config-id';
const LOCALE = 'locale';
const RACK = 'rack';

const store = store2.namespace('scrabble-solver');

const localStorage = {
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

  getRack(): (string | null)[] | undefined {
    return store.get(RACK);
  },

  setRack(rack: (string | null)[] | undefined): void {
    store.set(RACK, rack, true);
  },
};

export default localStorage;
