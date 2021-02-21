import { createSelector } from '@reduxjs/toolkit';
import { getLocaleConfig } from '@scrabble-solver/configs';
import { BLANK, CONSONANTS, VOWELS } from '@scrabble-solver/constants';
import { Cell, Config, Result } from '@scrabble-solver/types';

import i18n from 'i18n';
import { createKeyComparator, stringComparator } from 'lib';
import { RemainingTile, RemainingTilesGroup, Translations } from 'types';

import { findCell, getRemainingCount, getTotalCount, sortResults } from './lib';
import {
  selectBoardRoot,
  selectDictionaryRoot,
  selectRackRoot,
  selectResultsRoot,
  selectSettingsRoot,
  selectSolveRoot,
} from './root';

const selectCell = (_: unknown, cell: Cell): Cell => cell;

export const selectDictionary = selectDictionaryRoot;

export const selectAutoGroupTiles = createSelector([selectSettingsRoot], (settings) => settings.autoGroupTiles);

export const selectLocale = createSelector([selectSettingsRoot], (settings) => settings.locale);

export const selectBoard = selectBoardRoot;

export const selectConfigId = createSelector([selectSettingsRoot], (settings) => settings.configId);

export const selectConfig = createSelector([selectConfigId, selectLocale], getLocaleConfig);

export const selectResults = createSelector([selectResultsRoot], (results) => results.results);

export const selectResultsSortColumn = createSelector([selectResultsRoot], (results) => results.sort.column);

export const selectResultsSortDirection = createSelector([selectResultsRoot], (results) => results.sort.direction);

export const selectSortedResults = createSelector(
  [selectResults, selectResultsSortColumn, selectResultsSortDirection],
  (results, column, direction): Result[] | undefined => {
    if (typeof results === 'undefined') {
      return results;
    }

    return sortResults(results, column, direction);
  },
);

export const selectResultCandidate = createSelector([selectResultsRoot], (results) => results.candidate);

export const selectResultCandidateCells = createSelector(
  [selectResultCandidate],
  (resultCandidate) => (resultCandidate?.cells || []) as Cell[],
);

export const selectRowsWithCandidate = createSelector([selectBoardRoot, selectResultCandidateCells], (board, cells) => {
  return board.rows.map((row: Cell[], y: number) => row.map((cell: Cell, x: number) => findCell(cells, x, y) || cell));
});

export const selectBonus = createSelector([selectConfig, selectCell], (config: Config, cell: Cell) => {
  return config.getCellBonus(cell);
});

export const selectCharacterPoints = createSelector(
  [selectConfig, selectCell],
  (config: Config, cell: Cell): number => {
    return cell.tile.isBlank ? config.blankScore : config.pointsMap[cell.tile.character];
  },
);

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
    if (lastSolvedParameters.characters.length !== characters.length) {
      return true;
    }

    const aSorted = [...lastSolvedParameters.characters].sort(stringComparator);
    const bSorted = [...characters].sort(stringComparator);
    const areEqual = aSorted.every((character, index) => character === bSorted[index]);
    return !areEqual;
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
  [selectConfig, selectCharacters, selectBoardRoot],
  (config, characters, board): RemainingTile[] => {
    const nonEmptyCells = board.rows.flat().filter((cell) => !cell.isEmpty);
    const letterCells = nonEmptyCells.filter((cell) => !cell.tile.isBlank);
    const remainingTiles = Object.fromEntries(config.tiles.map((tile) => [tile.character, { ...tile, usedCount: 0 }]));
    const blank: RemainingTile = {
      character: BLANK,
      count: config.numberOfBlanks,
      score: config.blankScore,
      usedCount:
        nonEmptyCells.filter((cell) => cell.tile.isBlank).length +
        characters.filter((character) => character === BLANK).length,
    };
    const letters = [
      ...letterCells.map((cell) => cell.tile.character),
      ...characters.filter((letter) => letter !== BLANK),
    ];
    const unknownLetters = letters.filter((letter) => typeof remainingTiles[letter] === 'undefined');

    for (const letter of unknownLetters) {
      remainingTiles[letter] = {
        character: letter,
        count: 0,
        score: 0,
        usedCount: 0,
      };
    }

    for (const letter of letters) {
      ++remainingTiles[letter].usedCount;
    }

    return [...Object.values(remainingTiles).sort(createKeyComparator('character')), blank];
  },
);

export const selectHasOverusedTiles = createSelector([selectRemainingTiles], (remainingTiles) => {
  return remainingTiles.some(({ count, usedCount }) => usedCount > count);
});

export const selectRemainingTilesCount = createSelector([selectRemainingTiles], (remainingTiles) => {
  return getRemainingCount(remainingTiles);
});

export const selectRemainingTilesGroups = createSelector([selectRemainingTiles], (remainingTiles) => {
  const consonants = remainingTiles.filter(({ character }) => CONSONANTS.includes(character));
  const vowels = remainingTiles.filter(({ character }) => VOWELS.includes(character));
  const blanks = remainingTiles.filter(({ character }) => character === BLANK);
  const groups: RemainingTilesGroup[] = [
    {
      remainingCount: getRemainingCount(vowels),
      tiles: vowels,
      translationKey: 'common.vowels',
      totalCount: getTotalCount(vowels),
    },
    {
      remainingCount: getRemainingCount(consonants),
      tiles: consonants,
      translationKey: 'common.consonants',
      totalCount: getTotalCount(consonants),
    },
    {
      remainingCount: getRemainingCount(blanks),
      tiles: blanks,
      translationKey: 'common.blanks',
      totalCount: getTotalCount(blanks),
    },
  ];
  return groups;
});
