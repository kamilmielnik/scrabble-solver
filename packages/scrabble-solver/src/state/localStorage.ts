import { Board, type BoardJson, isObject, type Locale } from '@scrabble-solver/types';
import store2 from 'store2';

import type { Rack, Translations } from '@/types';

import type { SettingsState } from './settings/types';

const BOARD = 'board';
const RACK = 'rack';
const SETTINGS = 'settings';
const TRANSLATIONS = 'translations';

interface PersistedTranslations {
  locale: Locale;
  translations: Translations;
  version: string;
}

const LEGACY_KEYS: Record<keyof SettingsState, string> = {
  autoGroupTiles: 'auto-group-tiles',
  game: 'config-id',
  highlightUnreachableCells: 'highlight-unreachable-cells',
  inputMode: 'input-mode',
  locale: 'locale',
  removeCellFilters: 'remove-cell-filters',
  showCoordinates: 'show-coordinates',
};

const store = store2.namespace('scrabble-solver');

export const localStorage = {
  getBoard(): Board | undefined {
    try {
      const serialized = store.get(BOARD) as string | undefined;
      return serialized ? Board.fromJson(JSON.parse(serialized) as BoardJson) : undefined;
    } catch {
      store.remove(BOARD);
      return undefined;
    }
  },

  setBoard(board: Board | undefined): void {
    const serialized = board ? JSON.stringify(board.toJson()) : board;
    store.set(BOARD, serialized, true);
  },

  getRack(): Rack | undefined {
    const rack = store.get(RACK) as Rack | undefined;

    if (rack !== undefined && !Array.isArray(rack)) {
      store.remove(RACK);
      return undefined;
    }

    return rack;
  },

  setRack(rack: Rack | undefined): void {
    store.set(RACK, rack, true);
  },

  getSettings(): Partial<SettingsState> {
    const stored = store.get(SETTINGS) as Partial<SettingsState> | undefined;

    if (stored !== undefined && !isObject(stored)) {
      store.remove(SETTINGS);
    }

    return migrateHiddenShowCoordinates(isObject(stored) ? stored : migrateLegacySettings());
  },

  setSettings(settings: SettingsState): void {
    store.set(SETTINGS, settings, true);
  },

  getTranslations(locale: Locale, version: string): Translations | undefined {
    const stored = store.get(TRANSLATIONS) as PersistedTranslations | undefined;

    if (typeof stored === 'undefined') {
      return undefined;
    }

    if (!isObject(stored) || stored.locale !== locale || stored.version !== version || !isObject(stored.translations)) {
      store.remove(TRANSLATIONS);
      return undefined;
    }

    return stored.translations;
  },

  setTranslations(locale: Locale, version: string, translations: Translations): void {
    store.set(TRANSLATIONS, { locale, translations, version } satisfies PersistedTranslations, true);
  },
};

/**
 * Introduced in 2.15.26 on 2026/04/27.
 * Life expectancy: 1y.
 */
function migrateLegacySettings(): Partial<SettingsState> {
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
}

/**
 * The 'hidden' showCoordinates option was removed on 2026/08/13.
 * Life expectancy: 1y.
 */
function migrateHiddenShowCoordinates(settings: Partial<SettingsState>): Partial<SettingsState> {
  if (String(settings.showCoordinates) !== 'hidden') {
    return settings;
  }

  const migrated: Partial<SettingsState> = { ...settings, showCoordinates: 'original' };
  store.set(SETTINGS, migrated, true);
  return migrated;
}
