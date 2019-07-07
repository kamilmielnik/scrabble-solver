import { createSelector } from 'reselect';
import { BLANK } from '@scrabble-solver/constants';

import { selectCells } from 'board/selectors';
import { selectConfig } from 'config/selectors';
import { selectInput } from 'tiles/selectors';

import { getNumberOfRemainingCharacters, reduceCellStatistics } from './utils/statistics';

export const selectCharactersMap = createSelector(
  [selectConfig, selectInput],
  ({ tiles, pointsMap }, input) =>
    tiles.reduce(
      (charactersStatistics, { character, count }) => ({
        ...charactersStatistics,
        [character]: {
          character,
          count,
          points: pointsMap[character],
          usedCount: input.split(character).length - 1
        }
      }),
      {}
    )
);
export const selectNumberOfUsedBlanks = createSelector(
  [selectCells],
  (cells) => cells.filter((cell) => cell.tile.isBlank).length
);
export const selectBlankStatistics = createSelector(
  [selectConfig, selectNumberOfUsedBlanks],
  ({ blankScore, numberOfBlanks }, numberOfUsedBlanks) => ({
    character: BLANK,
    count: numberOfBlanks,
    points: blankScore,
    usedCount: numberOfUsedBlanks
  })
);
export const selectCharactersStatistics = createSelector(
  [selectBlankStatistics, selectCharactersMap, selectCells],
  (blankStatistics, charactersStatistics, cells) => [
    ...Object.values(cells.reduce(reduceCellStatistics, charactersStatistics)),
    blankStatistics
  ]
);
export const selectNumberOfRemainingCharacters = createSelector(
  [selectCharactersStatistics],
  getNumberOfRemainingCharacters
);
