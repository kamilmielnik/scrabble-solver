import { BLANK } from '@scrabble-solver/constants';
import { Cell, Game, Locale, Tile } from '@scrabble-solver/types';

import { englishTranslations } from '../../i18n/i18n';
import { type Translations } from '../../types';
import { i18nInitialState } from '../i18n';
import type { RootState } from '../types';

import { settingsInitialState } from './initialState';
import {
  selectAutoGroupTiles,
  selectCellBonus,
  selectCellIsValid,
  selectCharacterIsValid,
  selectCharacterPoints,
  selectConfig,
  selectGame,
  selectHighlightUnreachableCells,
  selectInputMode,
  selectLocale,
  selectLocaleAutoGroupTiles,
  selectRemoveCellFilters,
  selectSettings,
  selectShowCoordinates,
  selectTilePoints,
  selectTranslations,
} from './selectors';

describe('plain selectors', () => {
  it('select each setting', () => {
    const state = createState({ autoGroupTiles: 'right', highlightUnreachableCells: true });

    expect(selectSettings(state)).toBe(state.settings);
    expect(selectAutoGroupTiles(state)).toBe('right');
    expect(selectGame(state)).toBe(Game.Scrabble);
    expect(selectHighlightUnreachableCells(state)).toBe(true);
    expect(selectInputMode(state)).toBe('keyboard');
    expect(selectLocale(state)).toBe(Locale.EN_US);
    expect(selectRemoveCellFilters(state)).toBe('always');
    expect(selectShowCoordinates(state)).toBe('original');
  });
});

describe('selectLocaleAutoGroupTiles', () => {
  it('keeps the direction for left-to-right locales', () => {
    expect(selectLocaleAutoGroupTiles(createState({ autoGroupTiles: 'left' }))).toBe('left');
  });

  it('mirrors the direction for right-to-left locales', () => {
    expect(selectLocaleAutoGroupTiles(createState({ autoGroupTiles: 'left', locale: Locale.FA_IR }))).toBe('right');
    expect(selectLocaleAutoGroupTiles(createState({ autoGroupTiles: 'right', locale: Locale.FA_IR }))).toBe('left');
  });

  it('stays off when grouping is off, even right-to-left', () => {
    expect(selectLocaleAutoGroupTiles(createState({ autoGroupTiles: null, locale: Locale.FA_IR }))).toBeNull();
  });
});

describe('selectConfig', () => {
  it('combines game and locale', () => {
    const config = selectConfig(createState({ game: Game.Literaki, locale: Locale.PL_PL }));

    expect(config.game).toBe(Game.Literaki);
    expect(config.locale).toBe(Locale.PL_PL);
  });
});

describe('selectCharacterPoints', () => {
  const state = createState({});

  it('scores letters and blanks', () => {
    expect(selectCharacterPoints(state, 'q')).toBe(10);
    expect(selectCharacterPoints(state, BLANK)).toBe(0);
  });

  it('has no score for an empty slot', () => {
    expect(selectCharacterPoints(state, null)).toBeUndefined();
  });
});

describe('selectCharacterIsValid', () => {
  const state = createState({});

  it('accepts empty slots and blanks', () => {
    expect(selectCharacterIsValid(state, null)).toBe(true);
    expect(selectCharacterIsValid(state, BLANK)).toBe(true);
  });

  it('accepts only letters of the active alphabet', () => {
    expect(selectCharacterIsValid(state, 'a')).toBe(true);
    expect(selectCharacterIsValid(state, 'ą')).toBe(false);
    expect(selectCharacterIsValid(createState({ locale: Locale.PL_PL }), 'ą')).toBe(true);
  });
});

describe('selectCellBonus', () => {
  it('finds the bonus of a cell', () => {
    expect(selectCellBonus(createState({}), new Cell({ x: 0, y: 0 }))?.multiplier).toBe(3);
  });

  it('is undefined for a plain cell', () => {
    expect(selectCellBonus(createState({}), new Cell({ x: 1, y: 0 }))).toBeUndefined();
  });
});

describe('selectTilePoints', () => {
  const state = createState({});

  it('scores a letter tile', () => {
    expect(selectTilePoints(state, new Tile({ character: 'q' }))).toBe(10);
  });

  it('scores a blank tile with the blank score, not the letter it plays', () => {
    expect(selectTilePoints(state, new Tile({ character: 'q', isBlank: true }))).toBe(0);
  });

  it('has no score for no tile', () => {
    expect(selectTilePoints(state, null)).toBeUndefined();
  });
});

describe('selectCellIsValid', () => {
  const state = createState({});

  it('accepts an empty cell', () => {
    expect(selectCellIsValid(state, new Cell({ x: 0, y: 0 }))).toBe(true);
  });

  it('checks the letter on the cell', () => {
    expect(selectCellIsValid(state, new Cell({ tile: new Tile({ character: 'a' }), x: 0, y: 0 }))).toBe(true);
    expect(selectCellIsValid(state, new Cell({ tile: new Tile({ character: 'ą' }), x: 0, y: 0 }))).toBe(false);
  });
});

describe('selectTranslations', () => {
  it('falls back to complete English while the locale chunk is loading', () => {
    expect(selectTranslations(createState({ locale: Locale.PL_PL }))).toBe(englishTranslations);
  });

  it('uses the loaded translations of the active locale', () => {
    const polish = { menu: 'Menu PL' } as Translations;
    const state = {
      ...createState({ locale: Locale.PL_PL }),
      i18n: { translations: { [Locale.PL_PL]: polish } },
    };

    expect(selectTranslations(state)).toBe(polish);
  });
});

function createState(settings: Partial<RootState['settings']>): RootState {
  return { i18n: i18nInitialState, settings: { ...settingsInitialState, ...settings } } as RootState;
}
