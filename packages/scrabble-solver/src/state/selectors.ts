import { createSelector } from '@reduxjs/toolkit';
import { Board, Bonus, Cell, Config, Result } from '@scrabble-solver/models';

import { createKeyComparator, reverseComparator } from 'lib';
import { Locale } from 'types';

import { i18nInitialState } from './slices';
import { RootState } from './types';

const findCell = (cells: Cell[], x: number, y: number): Cell | undefined => {
  return cells.find((cell) => cell.x === x && cell.y === y);
};

const selectCell = (_: RootState, cell: Cell): Cell => cell;

const pointsComparator = reverseComparator(createKeyComparator('points'));

export const selectBoard = (state: RootState): Board => state.board;

// TODO: rename state.board.board to state.board.rows
export const selectRows = (state: RootState): Cell[][] => state.board.board;

export const selectCells = createSelector([selectRows], (rows) => {
  return rows.reduce<Cell[]>((cells: Cell[], row: Cell[]) => cells.concat(row), []);
});

export const selectConfig = (state: RootState): Config => state.config;

export const selectResults = (state: RootState): Result[] => [...state.results.results].sort(pointsComparator);

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

export const selectI18n = (state: RootState): typeof i18nInitialState => state.i18n;

export const selectLocale = (state: RootState): Locale => state.i18n.locale;

export const selectTranslations = createSelector([selectI18n], ({ i18n, locale }) => i18n[locale]);

export const selectTranslation = createSelector(
  [selectTranslations, selectLocale, (_: RootState, id: string) => id],
  (translations, locale, id): string => {
    const translation = translations[id];

    if (typeof translation === 'undefined') {
      throw new Error(`Untranslated key "${id}" in locale "${locale}"`);
    }

    return translation;
  },
);

export const selectTiles = (state: RootState): (string | null)[] => state.tiles;

export const selectCharacters = createSelector(selectTiles, (tiles) => tiles.filter((tile) => tile !== null));

export const selectIsLoading = (state: RootState): boolean => state.solve.isLoading;
