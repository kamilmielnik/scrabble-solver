import { createSelector } from '@reduxjs/toolkit';
import { getLocaleConfig } from '@scrabble-solver/configs';
import { Cell, Config, Tile } from '@scrabble-solver/types';

import i18n from 'i18n';
import {
  findCell,
  getRemainingTiles,
  getRemainingTilesCount,
  getRemainingTilesGroups,
  sortResults,
  unorderedArraysEqual,
} from 'lib';
import { Translations } from 'types';

import { RootState } from './types';

const selectCell = (_: unknown, cell: Cell): Cell => cell;

const selectCharacter = (_: unknown, character: string | null): string | null => character;

const selectTile = (_: unknown, tile: Tile | null): Tile | null => tile;

const selectBoardRoot = (state: RootState): RootState['board'] => state.board;

const selectDictionaryRoot = (state: RootState): RootState['dictionary'] => state.dictionary;

const selectRackRoot = (state: RootState): RootState['rack'] => state.rack;

const selectResultsRoot = (state: RootState): RootState['results'] => state.results;

const selectSettingsRoot = (state: RootState): RootState['settings'] => state.settings;

const selectSolveRoot = (state: RootState): RootState['solve'] => state.solve;

export const selectDictionary = selectDictionaryRoot;

export const selectAutoGroupTiles = createSelector([selectSettingsRoot], (settings) => settings.autoGroupTiles);

export const selectLocale = createSelector([selectSettingsRoot], (settings) => settings.locale);

export const selectBoard = selectBoardRoot;

export const selectConfigId = createSelector([selectSettingsRoot], (settings) => settings.configId);

export const selectConfig = createSelector([selectConfigId, selectLocale], getLocaleConfig);

export const selectResults = createSelector([selectResultsRoot], (results) => results.results);

export const selectResultsQuery = createSelector([selectResultsRoot], (results) => results.query);

export const selectResultsSortColumn = createSelector([selectResultsRoot], (results) => results.sort.column);

export const selectResultsSortDirection = createSelector([selectResultsRoot], (results) => results.sort.direction);

export const selectSortedResults = createSelector(
  [selectResults, selectResultsSortColumn, selectResultsSortDirection],
  sortResults,
);

export const selectSortedFilteredResults = createSelector(
  [selectSortedResults, selectResultsQuery],
  (results, query) => {
    if (!results || query.trim().length === 0) {
      return results;
    }

    return results.filter((result) => {
      const regExp = new RegExp(query, 'gi');
      return regExp.test(result.word);
    });
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

export const selectHaveCharactersChanged = createSelector(
  [selectLastSolvedParameters, selectCharacters],
  (lastSolvedParameters, characters) => {
    return !unorderedArraysEqual(lastSolvedParameters.characters, characters);
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
  [selectConfig, selectBoardRoot, selectCharacters],
  getRemainingTiles,
);

export const selectHasOverusedTiles = createSelector([selectRemainingTiles], (remainingTiles) => {
  return remainingTiles.some(({ count, usedCount }) => usedCount > count);
});

export const selectRemainingTilesCount = createSelector([selectRemainingTiles], (remainingTiles) => {
  return getRemainingTilesCount(remainingTiles);
});

export const selectRemainingTilesGroups = createSelector([selectRemainingTiles], getRemainingTilesGroups);
