import { createSelector } from '@reduxjs/toolkit';
import { BLANK } from '@scrabble-solver/constants';
import { Cell, Config, isError, Tile } from '@scrabble-solver/types';

import { i18n, LOCALE_FEATURES } from 'i18n';
import { findCell, getRemainingTiles, getRemainingTilesGroups, unorderedArraysEqual } from 'lib';
import { Point, ResultColumnId, Translations } from 'types';

import { RootState } from '../types';

import { selectCharacters } from './rack';
import { selectResultCandidateCells } from './results';
import { selectBoard, selectCellFilters } from './root';
import { selectConfig, selectLocale, selectShowCoordinates } from './settings';

const selectCell = (_: unknown, cell: Cell): Cell => cell;

const selectPoint = (_: unknown, point: Point): Point => point;

const selectCharacter = (_: unknown, character: string | null): string | null => character;

const selectTile = (_: unknown, tile: Tile | null): Tile | null => tile;

const selectSolveRoot = (state: RootState): RootState['solve'] => state.solve;

export const selectCellFilter = createSelector([selectCellFilters, selectPoint], (cellFilters, { x, y }) => {
  return cellFilters.find((cell) => cell.x === x && cell.y === y);
});

export const selectCellIsValid = createSelector([selectConfig, selectCell], (config, cell) => {
  if (!cell.hasTile()) {
    return true;
  }

  return config.tiles.some((tile) => tile.character === cell.tile.character);
});

export const selectRowsWithCandidate = createSelector([selectBoard, selectResultCandidateCells], (board, cells) => {
  return board.rows.map((row: Cell[], y: number) => row.map((cell: Cell, x: number) => findCell(cells, x, y) || cell));
});

export const selectCellBonus = createSelector([selectConfig, selectCell], (config: Config, cell: Cell) => {
  return config.getCellBonus(cell);
});

export const selectCharacterPoints = createSelector(
  [selectConfig, selectCharacter],
  (config: Config, character: string | null) => {
    return config.getCharacterPoints(character);
  },
);

export const selectCharacterIsValid = createSelector(
  [selectConfig, selectCharacter],
  (config: Config, character: string | null) => {
    if (character === null || character === BLANK) {
      return true;
    }

    return config.tiles.some((tile) => tile.character === character);
  },
);

export const selectTilePoints = createSelector([selectConfig, selectTile], (config: Config, tile: Tile | null) => {
  return config.getTilePoints(tile);
});

export const selectTranslations = createSelector([selectLocale], (locale) => i18n[locale]);

export const selectTranslation = createSelector(
  [selectTranslations, selectLocale, (_: unknown, id: keyof Translations) => id],
  (translations, locale, id): string => {
    const translation = translations[id];

    if (typeof translation === 'undefined') {
      throw new Error(`Untranslated key "${id}" in locale "${locale}"`);
    }

    return translation;
  },
);

export const selectLastSolvedParameters = createSelector([selectSolveRoot], (solve) => solve.lastSolvedParameters);

export const selectIsLoading = createSelector([selectSolveRoot], (solve) => solve.isLoading);

export const selectSolveError = createSelector([selectSolveRoot], (solve) => {
  return isError(solve.error) ? solve.error : undefined;
});

export const selectHaveCharactersChanged = createSelector(
  [selectLastSolvedParameters, selectCharacters, selectLocale],
  (lastSolvedParameters, characters, locale) => {
    return !unorderedArraysEqual(lastSolvedParameters.characters, characters, locale);
  },
);

export const selectHasBoardChanged = createSelector(
  [selectLastSolvedParameters, selectBoard],
  (lastSolvedParameters, board) => !lastSolvedParameters.board.equals(board),
);

export const selectAreResultsOutdated = createSelector(
  [selectHasBoardChanged, selectHaveCharactersChanged],
  (hasBoardChanged, haveCharactersChanged) => hasBoardChanged || haveCharactersChanged,
);

export const selectRemainingTiles = createSelector(
  [selectConfig, selectBoard, selectCharacters, selectLocale],
  getRemainingTiles,
);

export const selectHasOverusedTiles = createSelector([selectRemainingTiles], (remainingTiles) => {
  return remainingTiles.some(({ count, usedCount }) => usedCount > count);
});

export const selectRemainingTilesGroups = createSelector([selectRemainingTiles], getRemainingTilesGroups);

export const selectColumns = createSelector([selectLocale, selectShowCoordinates], (locale, showCoordinates) => {
  const { consonants, vowels } = LOCALE_FEATURES[locale];
  const columns: ResultColumnId[] = [
    ResultColumnId.Word,
    ResultColumnId.TilesCount,
    ResultColumnId.BlanksCount,
    ResultColumnId.WordsCount,
    ResultColumnId.Points,
  ];

  if (showCoordinates !== 'hidden') {
    columns.push(ResultColumnId.Coordinates);
  }

  if (vowels) {
    columns.push(ResultColumnId.VowelsCount);
  }

  if (consonants) {
    columns.push(ResultColumnId.ConsonantsCount);
  }

  return columns;
});
