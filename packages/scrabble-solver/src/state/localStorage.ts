import { Board, type BoardJson } from '@scrabble-solver/types';
import store2 from 'store2';

import type { Rack } from '@/types';

import type { SettingsState } from './settings/types';

const BOARD = 'board';
const RACK = 'rack';
const SETTINGS = 'settings';

const LEGACY_KEYS: Record<keyof SettingsState, string> = {
  autoGroupTiles: 'auto-group-tiles',
  game: 'config-id',
  inputMode: 'input-mode',
  locale: 'locale',
  removeCellFilters: 'remove-cell-filters',
  showCoordinates: 'show-coordinates',
};

const store = store2.namespace('scrabble-solver');

/**
 * Introduced in 2.15.26 on 2026/04/27.
 * Life expectancy: 1y.
 */
const migrateLegacySettings = (): Partial<SettingsState> => {
  const settings: Partial<SettingsState> = {};
  let hasLegacy = false;

  for (const [setting, legacyKey] of Object.entries(LEGACY_KEYS) as [keyof SettingsState, string][]) {
    if (store.has(legacyKey)) {
      settings[setting] = store.get(legacyKey);
      store.remove(legacyKey);
      hasLegacy = true;
    }
  }

  if (hasLegacy) {
    store.set(SETTINGS, settings, true);
  }

  return settings;
};

export const localStorage = {
  getBoard(): Board | undefined {
    const serialized = store.get(BOARD) as string | undefined;
    return serialized ? Board.fromJson(JSON.parse(serialized) as BoardJson) : undefined;
  },

  setBoard(board: Board | undefined): void {
    const serialized = board ? JSON.stringify(board.toJson()) : board;
    store.set(BOARD, serialized, true);
  },

  getRack(): Rack | undefined {
    return store.get(RACK) as Rack | undefined;
  },

  setRack(rack: Rack | undefined): void {
    store.set(RACK, rack, true);
  },

  getSettings(): Partial<SettingsState> {
    const stored = store.get(SETTINGS) as Partial<SettingsState> | undefined;
    return stored ?? migrateLegacySettings();
  },

  setSettings(settings: SettingsState): void {
    store.set(SETTINGS, settings, true);
  },
};
