/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Board, Game, Locale } from '@scrabble-solver/types';

import { englishTranslations } from '../i18n/i18n';
import type { Translations } from '../types';

import { localStorage } from './localStorage';
import { settingsInitialState } from './settings';
import { type SettingsState } from './settings/types';

const version = '1.0.0';

describe('board', () => {
  it('round-trips a board', () => {
    const board = Board.fromStringArray(['ab', ' c']);

    localStorage.setBoard(board);

    expect(localStorage.getBoard()?.equals(board)).toBe(true);
  });

  it('is undefined when nothing is stored', () => {
    expect(localStorage.getBoard()).toBeUndefined();
  });

  it.each(['"not json"', '"{}"', '"[]"'])('removes the corrupt entry %s', (stored) => {
    write('board', stored);

    expect(localStorage.getBoard()).toBeUndefined();
    expect(read('board')).toBeNull();
  });

  it('clears the entry when set to undefined', () => {
    localStorage.setBoard(Board.create(1, 1));
    localStorage.setBoard(undefined);

    expect(localStorage.getBoard()).toBeUndefined();
  });
});

describe('rack', () => {
  it('round-trips a rack', () => {
    localStorage.setRack(['a', null]);

    expect(localStorage.getRack()).toEqual(['a', null]);
  });

  it('is undefined when nothing is stored', () => {
    expect(localStorage.getRack()).toBeUndefined();
  });

  it.each(['"text"', '{"a":1}', '1'])('removes the mismatched entry %s', (stored) => {
    write('rack', stored);

    expect(localStorage.getRack()).toBeUndefined();
    expect(read('rack')).toBeNull();
  });
});

describe('settings', () => {
  it('round-trips settings', () => {
    localStorage.setSettings(settingsInitialState);

    expect(localStorage.getSettings()).toEqual(settingsInitialState);
  });

  it('is empty when nothing is stored', () => {
    expect(localStorage.getSettings()).toEqual({});
  });

  it.each(['"text"', '1'])('removes the mismatched entry %s and returns no settings', (stored) => {
    write('settings', stored);

    expect(localStorage.getSettings()).toEqual({});
    expect(read('settings')).toBeNull();
  });

  describe('legacy keys', () => {
    it('migrates every legacy key into the settings entry and removes it', () => {
      write('auto-group-tiles', '"left"');
      write('config-id', `"${Game.Literaki}"`);
      write('highlight-unreachable-cells', 'true');
      write('input-mode', '"touchscreen"');
      write('locale', `"${Locale.PL_PL}"`);
      write('remove-cell-filters', '"never"');
      write('show-coordinates', '"alternative"');

      const expected: Partial<SettingsState> = {
        autoGroupTiles: 'left',
        game: Game.Literaki,
        highlightUnreachableCells: true,
        inputMode: 'touchscreen',
        locale: Locale.PL_PL,
        removeCellFilters: 'never',
        showCoordinates: 'alternative',
      };

      expect(localStorage.getSettings()).toEqual(expected);
      expect(JSON.parse(read('settings')!)).toEqual(expected);
      expect(read('config-id')).toBeNull();
      expect(read('locale')).toBeNull();
    });

    it('migrates only keys that exist', () => {
      write('locale', `"${Locale.DE_DE}"`);

      expect(localStorage.getSettings()).toEqual({ locale: Locale.DE_DE });
    });

    it('does not create a settings entry when there is nothing to migrate', () => {
      localStorage.getSettings();

      expect(read('settings')).toBeNull();
    });

    it('ignores legacy keys once a settings entry exists', () => {
      localStorage.setSettings(settingsInitialState);
      write('locale', `"${Locale.DE_DE}"`);

      expect(localStorage.getSettings().locale).toBe(settingsInitialState.locale);
      expect(read('locale')).not.toBeNull();
    });
  });

  describe("removed 'hidden' showCoordinates option", () => {
    it('migrates it to original and persists the result', () => {
      write('settings', JSON.stringify({ game: Game.Literaki, showCoordinates: 'hidden' }));

      expect(localStorage.getSettings()).toEqual({ game: Game.Literaki, showCoordinates: 'original' });
      expect(JSON.parse(read('settings')!).showCoordinates).toBe('original');
    });

    it('migrates a legacy value too', () => {
      write('show-coordinates', '"hidden"');

      expect(localStorage.getSettings().showCoordinates).toBe('original');
      expect(JSON.parse(read('settings')!).showCoordinates).toBe('original');
    });

    it('leaves other values alone', () => {
      write('settings', JSON.stringify({ showCoordinates: 'alternative' }));

      expect(localStorage.getSettings().showCoordinates).toBe('alternative');
    });
  });
});

describe('translations', () => {
  const translations = englishTranslations;

  it('round-trips translations for the same locale and version', () => {
    localStorage.setTranslations(Locale.PL_PL, version, translations);

    expect(localStorage.getTranslations(Locale.PL_PL, version)).toEqual(translations);
  });

  it('is undefined when nothing is stored, without touching storage', () => {
    expect(localStorage.getTranslations(Locale.PL_PL, version)).toBeUndefined();
  });

  it('rejects and removes a cache of another locale', () => {
    localStorage.setTranslations(Locale.PL_PL, version, translations);

    expect(localStorage.getTranslations(Locale.DE_DE, version)).toBeUndefined();
    expect(read('translations')).toBeNull();
  });

  it('rejects and removes a cache of another version', () => {
    localStorage.setTranslations(Locale.PL_PL, version, translations);

    expect(localStorage.getTranslations(Locale.PL_PL, '2.0.0')).toBeUndefined();
    expect(read('translations')).toBeNull();
  });

  it('rejects and removes a cache missing a key of the bundled English object (#452)', () => {
    const { menu: _menu, ...incomplete } = translations;

    localStorage.setTranslations(Locale.PL_PL, version, incomplete as Translations);

    expect(localStorage.getTranslations(Locale.PL_PL, version)).toBeUndefined();
    expect(read('translations')).toBeNull();
  });

  it('rejects a cache with a non-string value', () => {
    localStorage.setTranslations(Locale.PL_PL, version, { ...translations, menu: 1 } as unknown as Translations);

    expect(localStorage.getTranslations(Locale.PL_PL, version)).toBeUndefined();
  });

  it.each(['"text"', `{"locale":"pl-PL","version":"${version}","translations":"text"}`])(
    'rejects the mismatched entry %s',
    (stored) => {
      write('translations', stored);

      expect(localStorage.getTranslations(Locale.PL_PL, version)).toBeUndefined();
      expect(read('translations')).toBeNull();
    },
  );
});

function write(key: string, value: string): void {
  window.localStorage.setItem(`scrabble-solver.${key}`, value);
}

function read(key: string): string | null {
  return window.localStorage.getItem(`scrabble-solver.${key}`);
}
