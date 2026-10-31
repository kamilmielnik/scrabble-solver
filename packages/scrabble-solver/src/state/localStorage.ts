import { type BoardJson, type Locale, Board, isObject } from '@scrabble-solver/types';
import store2 from 'store2';

import { englishTranslations } from '@/i18n/i18n';
import type { Rack, TranslationKey, Translations } from '@/types';

import { type BoardsMetadata, type BoardSnapshot, FIRST_BOARD_ID } from './boards/types-and-id';
import type { SettingsState } from './settings/types';

const BOARD = 'board';
const BOARDS = 'boards';
const RACK = 'rack';
const SETTINGS = 'settings';
const TRANSLATIONS = 'translations';

/** One key per board, so editing one board does not rewrite the others. */
const boardKey = (id: string): string => `board:${id}`;

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
  /**
   * Metadata for the saved boards, migrating a pre-tabs installation's single
   * board into the collection on the way.
   */
  getBoards(): BoardsMetadata | undefined {
    const stored = store.get(BOARDS) as BoardsMetadata | undefined;

    if (stored !== undefined && !isBoardsMetadata(stored)) {
      store.remove(BOARDS);
      return migrateSingleBoard();
    }

    return isBoardsMetadata(stored) ? stored : migrateSingleBoard();
  },

  getBoardSnapshot(id: string): BoardSnapshot | undefined {
    try {
      const stored = store.get(boardKey(id)) as BoardSnapshot | undefined;
      return isBoardSnapshot(stored) ? stored : undefined;
    } catch {
      store.remove(boardKey(id));
      return undefined;
    }
  },

  setBoardSnapshot(id: string, snapshot: BoardSnapshot): void {
    store.set(boardKey(id), snapshot, true);
  },

  /**
   * Writes the metadata, the snapshots of the inactive boards, and removes
   * the keys of boards that no longer exist.
   *
   * The inactive snapshots are rewritten wholesale rather than diffed because
   * the only things that change them -- switching, creating, deleting,
   * renaming -- are deliberate user actions, a handful of times a session.
   * The active board, which changes on every keystroke, is written on its own
   * by `setBoardSnapshot`.
   */
  setBoards(metadata: BoardsMetadata, saved: Record<string, BoardSnapshot>): void {
    store.set(BOARDS, metadata, true);

    for (const [id, snapshot] of Object.entries(saved)) {
      store.set(boardKey(id), snapshot, true);
    }

    for (const key of store.keys() as string[]) {
      const id = key.startsWith('board:') ? key.slice('board:'.length) : undefined;

      if (id !== undefined && !metadata.order.includes(id)) {
        store.remove(key);
      }
    }
  },

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

    if (
      !isObject(stored) ||
      stored.locale !== locale ||
      stored.version !== version ||
      !isObject(stored.translations) ||
      !hasEveryTranslation(stored.translations)
    ) {
      store.remove(TRANSLATIONS);
      return undefined;
    }

    return stored.translations;
  },

  setTranslations(locale: Locale, version: string, translations: Translations): void {
    store.set(TRANSLATIONS, { locale, translations, version } satisfies PersistedTranslations, true);
  },
};

function isBoardsMetadata(value: unknown): value is BoardsMetadata {
  if (!isObject(value)) {
    return false;
  }

  const { activeId, names, order } = value as Record<keyof BoardsMetadata, unknown>;
  return (
    typeof activeId === 'string' &&
    Array.isArray(order) &&
    order.every((id) => typeof id === 'string') &&
    isObject(names)
  );
}

function isBoardSnapshot(value: unknown): value is BoardSnapshot {
  if (!isObject(value)) {
    return false;
  }

  const { board, cellFilters, rack } = value as Record<keyof BoardSnapshot, unknown>;
  return Array.isArray(board) && Array.isArray(rack) && Array.isArray(cellFilters);
}

/**
 * Turns the single board of a pre-tabs installation into the first entry of
 * the collection, so an existing user's game in progress survives the upgrade
 * rather than being silently replaced by an empty board.
 *
 * Introduced on 2026/10/31.
 * Life expectancy: 1y.
 */
function migrateSingleBoard(): BoardsMetadata | undefined {
  const hasLegacy = store.has(BOARD) || store.has(RACK);

  if (!hasLegacy) {
    return undefined;
  }

  const board = localStorage.getBoard();
  const rack = localStorage.getRack();
  const metadata: BoardsMetadata = { activeId: FIRST_BOARD_ID, names: {}, order: [FIRST_BOARD_ID] };

  localStorage.setBoardSnapshot(FIRST_BOARD_ID, {
    board: (board ?? Board.create(1, 1)).toJson(),
    cellFilters: [],
    rack: rack ?? [],
  });
  store.set(BOARDS, metadata, true);
  store.remove(BOARD);
  store.remove(RACK);
  return metadata;
}

function hasEveryTranslation(translations: Translations): boolean {
  return (Object.keys(englishTranslations) as TranslationKey[]).every((key) => typeof translations[key] === 'string');
}

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
