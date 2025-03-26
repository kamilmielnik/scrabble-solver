import { createSelector } from '@reduxjs/toolkit';
import { Cell } from '@scrabble-solver/types';

import { i18n, LOCALE_FEATURES } from 'i18n';
import { findCell, getRemainingTiles, getRemainingTilesGroups, unorderedArraysEqual } from 'lib';
import { ResultColumnId, TranslationKey } from 'types';

import { selectCharacters } from './rack';
import { selectResultCandidateCells } from './results';
import { selectBoard } from './root';
import { selectConfig, selectLocale, selectShowCoordinates } from './settings';
import { selectLastSolvedParameters } from './solve';

export const selectRowsWithCandidate = createSelector([selectBoard, selectResultCandidateCells], (board, cells) => {
  return board.rows.map((row: Cell[], y: number) => row.map((cell: Cell, x: number) => findCell(cells, x, y) || cell));
});

export const selectTranslations = createSelector([selectLocale], (locale) => i18n[locale]);

const selectTranslationKey = (_: unknown, key: TranslationKey): TranslationKey => key;

export const selectTranslation = createSelector(
  [selectTranslations, selectLocale, selectTranslationKey],
  (translations, locale, key): string => {
    const translation = translations[key];

    if (typeof translation === 'undefined') {
      throw new Error(`Untranslated key "${key}" in locale "${locale}"`);
    }

    return translation;
  },
);

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
