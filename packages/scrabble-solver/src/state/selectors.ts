import { createSelector } from '@reduxjs/toolkit';
import { getLocaleConfig } from '@scrabble-solver/configs';
import { BLANK } from '@scrabble-solver/constants';
import { Board, Bonus, Cell, Config, Result } from '@scrabble-solver/types';

import i18n from 'i18n';
import { createKeyComparator, reverseComparator, stringComparator } from 'lib';
import { Translations } from 'types';

import { RootState } from './types';

const findCell = (cells: Cell[], x: number, y: number): Cell | undefined => {
  return cells.find((cell) => cell.x === x && cell.y === y);
};

const selectCell = (_: RootState, cell: Cell): Cell => cell;

const pointsComparator = reverseComparator(createKeyComparator('points'));

export const selectSettingsRoot = (state: RootState): RootState['settings'] => state.settings;

export const selectAutoGroupTiles = createSelector([selectSettingsRoot], (settings) => settings.autoGroupTiles);

export const selectLocale = createSelector([selectSettingsRoot], (settings) => settings.locale);

export const selectBoard = (state: RootState): Board => state.board;

export const selectRows = (state: RootState): Cell[][] => state.board.rows;

export const selectCells = createSelector([selectRows], (rows) => {
  return rows.reduce<Cell[]>((cells: Cell[], row: Cell[]) => cells.concat(row), []);
});

export const selectConfigId = createSelector([selectSettingsRoot], (settings) => settings.configId);

export const selectConfig = createSelector([selectConfigId, selectLocale], (configId, locale) => {
  return getLocaleConfig(configId, locale);
});

export const selectResults = (state: RootState): Result[] | undefined => state.results.results;

export const selectSortedResults = createSelector([selectResults], (results): Result[] | undefined => {
  if (typeof results === 'undefined') {
    return results;
  }

  return [...results].sort(pointsComparator);
});

export const selectResultCandidate = (state: RootState): Result | null => state.results.candidate;

export const selectResultCandidateCells = createSelector(
  [selectResultCandidate],
  (resultCandidate) => (resultCandidate?.cells || []) as Cell[],
);

export const selectRowsWithCandidate = createSelector([selectRows, selectResultCandidateCells], (rows, cells) => {
  return rows.map((row: Cell[], y: number) => row.map((cell: Cell, x: number) => findCell(cells, x, y) || cell));
});

export const selectBonus = createSelector([selectConfig, selectCell], (config: Config, cell: Cell):
  | Bonus
  | undefined => {
  return config.bonuses.find((bonus: Bonus) => bonus.matchesCellCoordinates(cell));
});

export const selectCharacterPoints = createSelector(
  [selectConfig, selectCell],
  (config: Config, cell: Cell): number => {
    return cell.tile.isBlank ? config.blankScore : config.pointsMap[cell.tile.character];
  },
);

export const selectTranslations = createSelector([selectLocale], (locale) => i18n[locale]);

export const selectTranslation = createSelector(
  [selectTranslations, selectLocale, (_: RootState, id: keyof Translations) => id],
  (translations, locale, id): string => {
    const translation = translations[id];

    if (typeof translation === 'undefined') {
      throw new Error(`Untranslated key "${id}" in locale "${locale}"`);
    }

    return translation;
  },
);

export const selectRack = (state: RootState): (string | null)[] => state.rack;

export const selectCharacters = createSelector(
  selectRack,
  (rack): string[] => rack.filter((tile) => tile !== null) as string[],
);

export const selectLastSolvedParameters = (state: RootState): RootState['solve']['lastSolvedParameters'] => {
  return state.solve.lastSolvedParameters;
};

export const selectIsLoading = (state: RootState): boolean => state.solve.isLoading;

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
  [selectLastSolvedParameters, selectBoard],
  (lastSolvedParameters, board) => !lastSolvedParameters.board.equals(board),
);

export const selectAreResultsOutdated = createSelector(
  [selectHasBoardChanged, selectHaveCharactersChanged],
  (hasBoardChanged, haveCharactersChanged) => hasBoardChanged || haveCharactersChanged,
);

export const selectDictionaryRoot = (state: RootState): RootState['dictionary'] => state.dictionary;

export const selectRemainingTiles = createSelector(
  [selectConfig, selectCharacters, selectRows],
  (config, characters, rows) => {
    const nonEmptyCells = rows.flat().filter((cell) => !cell.isEmpty);
    const letterCells = nonEmptyCells.filter((cell) => !cell.tile.isBlank);
    const remainingTiles = Object.fromEntries(config.tiles.map((tile) => [tile.character, { ...tile, usedCount: 0 }]));
    const blank = {
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
