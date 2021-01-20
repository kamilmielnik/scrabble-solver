import { Board, Locale } from '@scrabble-solver/types';
import store2 from 'store2';

const BOARD = 'board';
const CONFIG_ID = 'config-id';
const HAS_VISITED = 'has-visited';
const LOCALE = 'locale';
const TILES = 'tiles';

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

  getHasVisited(): boolean {
    return Boolean(store.get(HAS_VISITED));
  },

  setHasVisited(hasVisited: boolean): void {
    store.set(HAS_VISITED, hasVisited, true);
  },

  getLocale(): Locale | undefined {
    return store.get(LOCALE);
  },

  setLocale(locale: Locale | undefined): void {
    store.set(LOCALE, locale, true);
  },

  getTiles(): (string | null)[] | undefined {
    return store.get(TILES);
  },

  setTiles(tiles: (string | null)[] | undefined): void {
    store.set(TILES, tiles, true);
  },
};

export default localStorage;
