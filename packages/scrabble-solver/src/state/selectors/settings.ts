import { createSelector } from '@reduxjs/toolkit';
import { getConfig } from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import { Cell, Tile } from '@scrabble-solver/types';

import { LOCALE_FEATURES } from 'i18n';

import { selectSettings } from './root';

const selectCell = (_: unknown, cell: Cell): Cell => cell;

const selectCharacter = (_: unknown, character: string | null): string | null => character;

const selectTile = (_: unknown, tile: Tile | null): Tile | null => tile;

export const selectAutoGroupTiles = createSelector([selectSettings], (settings) => settings.autoGroupTiles);

export const selectGame = createSelector([selectSettings], (settings) => settings.game);

export const selectInputMode = createSelector([selectSettings], (settings) => settings.inputMode);

export const selectLocale = createSelector([selectSettings], (settings) => settings.locale);

export const selectLocaleAutoGroupTiles = createSelector([selectLocale, selectSettings], (locale, settings) => {
  if (LOCALE_FEATURES[locale].direction === 'ltr' || settings.autoGroupTiles === null) {
    return settings.autoGroupTiles;
  }

  return settings.autoGroupTiles === 'left' ? 'right' : 'left';
});

export const selectShowCoordinates = createSelector([selectSettings], (settings) => settings.showCoordinates);

export const selectConfig = createSelector([selectGame, selectLocale], getConfig);

export const selectCharacterPoints = createSelector([selectConfig, selectCharacter], (config, character) => {
  return config.getCharacterPoints(character);
});

export const selectCharacterIsValid = createSelector([selectConfig, selectCharacter], (config, character) => {
  if (character === null || character === BLANK) {
    return true;
  }

  return config.tiles.some((tile) => tile.character === character);
});

export const selectCellBonus = createSelector([selectConfig, selectCell], (config, cell) => {
  return config.getCellBonus(cell);
});

export const selectTilePoints = createSelector([selectConfig, selectTile], (config, tile) => {
  return config.getTilePoints(tile);
});

export const selectCellIsValid = createSelector([selectConfig, selectCell], (config, cell) => {
  if (!cell.hasTile()) {
    return true;
  }

  return config.tiles.some((tile) => tile.character === cell.tile.character);
});
