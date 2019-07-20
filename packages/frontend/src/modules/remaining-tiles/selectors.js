import { createSelector } from 'reselect';
import { BLANK } from '@scrabble-solver/constants';

import { selectCells } from 'board/selectors';
import { selectConfig } from 'config/selectors';
import { selectCharacters } from 'tiles';

import { getNumberOfRemainingCharacters, reduceCellStatistics } from './utils/statistics';

export const selectCharactersMap = createSelector(
  [selectConfig, selectCharacters],
  (config, characters) =>
    config.tiles.reduce(
      (charactersStatistics, tile) => ({
        ...charactersStatistics,
        [tile.character]: {
          character: tile.character,
          count: tile.count,
          points: config.pointsMap[tile.character],
          usedCount: characters.reduce((count, character) => count + (character === tile.character ? 1 : 0), 0)
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
