/* eslint-disable max-lines */

import { createSelector } from '@reduxjs/toolkit';
import { getConfig } from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import { Cell, Config, isError, Tile } from '@scrabble-solver/types';

import { i18n, LOCALE_FEATURES } from 'i18n';
import {
  createRegExp,
  findCell,
  getRemainingTiles,
  getRemainingTilesGroups,
  groupResults,
  resultMatchesCellFilter,
  sortGroupedResults,
  unorderedArraysEqual,
} from 'lib';
import { Point, ResultColumnId, Translations } from 'types';

import { RootState } from './types';

const selectCell = (_: unknown, cell: Cell): Cell => cell;

const selectPoint = (_: unknown, point: Point): Point => point;

const selectResultIndex = (_: unknown, index: number): number => index;

const selectCharacter = (_: unknown, character: string | null): string | null => character;

const selectTile = (_: unknown, tile: Tile | null): Tile | null => tile;

const selectBoardRoot = (state: RootState): RootState['board'] => state.board;

const selectDictionaryRoot = (state: RootState): RootState['dictionary'] => state.dictionary;

const selectCellFilterRoot = (state: RootState): RootState['cellFilter'] => state.cellFilter;

const selectRackRoot = (state: RootState): RootState['rack'] => state.rack;

const selectResultsRoot = (state: RootState): RootState['results'] => state.results;

const selectSettingsRoot = (state: RootState): RootState['settings'] => state.settings;

const selectSolveRoot = (state: RootState): RootState['solve'] => state.solve;

const selectVerifyRoot = (state: RootState): RootState['verify'] => state.verify;

export const selectDictionary = selectDictionaryRoot;

export const selectDictionaryError = createSelector([selectDictionaryRoot], (dictionary) => {
  return isError(dictionary.error) ? dictionary.error : undefined;
});

export const selectLocale = createSelector([selectSettingsRoot], (settings) => settings.locale);

export const selectAutoGroupTiles = createSelector([selectSettingsRoot], (settings) => settings.autoGroupTiles);

export const selectLocaleAutoGroupTiles = createSelector([selectLocale, selectSettingsRoot], (locale, settings) => {
  if (LOCALE_FEATURES[locale].direction === 'ltr' || settings.autoGroupTiles === null) {
    return settings.autoGroupTiles;
  }

  return settings.autoGroupTiles === 'left' ? 'right' : 'left';
});

export const selectBoard = selectBoardRoot;

export const selectInputMode = createSelector([selectSettingsRoot], (settings) => settings.inputMode);

export const selectShowCoordinates = createSelector([selectSettingsRoot], (settings) => settings.showCoordinates);

export const selectGame = createSelector([selectSettingsRoot], (settings) => settings.game);

export const selectConfig = createSelector([selectGame, selectLocale], getConfig);

export const selectFilteredCells = selectCellFilterRoot;

export const selectCellFilter = createSelector([selectFilteredCells, selectPoint], (cellFilter, { x, y }) => {
  return cellFilter.find((cell) => cell.x === x && cell.y === y);
});

export const selectCellIsValid = createSelector([selectConfig, selectCell], (config, cell) => {
  if (!cell.hasTile()) {
    return true;
  }

  return config.tiles.some((tile) => tile.character === cell.tile.character);
});

export const selectResultsRaw = createSelector([selectResultsRoot], (results) => results.results);

export const selectResultsQuery = createSelector([selectResultsRoot], (results) => results.query);

export const selectResultsSort = createSelector([selectResultsRoot], (results) => results.sort);

export const selectGroupedResults = createSelector(
  [selectResultsRaw, selectResultsQuery, selectFilteredCells],
  groupResults,
);

export const selectGroupedSortedResults = createSelector(
  [selectGroupedResults, selectResultsSort, selectLocale, selectShowCoordinates],
  sortGroupedResults,
);

export const selectResults = createSelector([selectGroupedSortedResults], (groupedResults) => {
  return groupedResults ? [...groupedResults.matching, ...groupedResults.other] : groupedResults;
});

export const selectIsResultMatching = createSelector(
  [selectResults, selectResultsQuery, selectFilteredCells, selectResultIndex],
  (results, query, cellFilter, index) => {
    if (!results) {
      return false;
    }

    const result = results[index];
    const regExp = createRegExp(query);

    if (!regExp.test(result.word)) {
      return false;
    }

    return resultMatchesCellFilter(result, cellFilter);
  },
);

export const selectResultCandidate = createSelector([selectResultsRoot], (results) => results.candidate);

export const selectResultCandidateCells = createSelector(
  [selectResultCandidate],
  (resultCandidate): Cell[] => resultCandidate?.cells || [],
);

export const selectResultCandidateTiles = createSelector(
  [selectResultCandidate],
  (resultCandidate): Tile[] => resultCandidate?.tiles || [],
);

export const selectRowsWithCandidate = createSelector([selectBoardRoot, selectResultCandidateCells], (board, cells) => {
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

export const selectRack = selectRackRoot;

export const selectCharacters = createSelector(
  selectRackRoot,
  (rack): string[] => rack.filter((tile) => tile !== null) as string[],
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
  [selectLastSolvedParameters, selectBoardRoot],
  (lastSolvedParameters, board) => !lastSolvedParameters.board.equals(board),
);

export const selectAreResultsOutdated = createSelector(
  [selectHasBoardChanged, selectHaveCharactersChanged],
  (hasBoardChanged, haveCharactersChanged) => hasBoardChanged || haveCharactersChanged,
);

export const selectRemainingTiles = createSelector(
  [selectConfig, selectBoardRoot, selectCharacters, selectLocale],
  getRemainingTiles,
);

export const selectHasOverusedTiles = createSelector([selectRemainingTiles], (remainingTiles) => {
  return remainingTiles.some(({ count, usedCount }) => usedCount > count);
});

export const selectRemainingTilesGroups = createSelector([selectRemainingTiles], getRemainingTilesGroups);

export const selectVerify = selectVerifyRoot;

export const selectHasInvalidWords = createSelector([selectVerify], ({ invalidWords }) => {
  return invalidWords.length > 0;
});

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
