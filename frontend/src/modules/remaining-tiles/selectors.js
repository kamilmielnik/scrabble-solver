import { createSelector } from 'reselect';
import { selectCells } from 'board/selectors';
import { selectConfig } from 'config/selectors';
import { selectInput } from 'tiles/selectors';
import {
  getNumberOfRemainingCharacters,
  reduceCellStatistics
} from './utils/statistics';

export const selectCharactersMap = createSelector(
  [ selectConfig, selectInput ],
  ({ characters, pointsMap }, input) => characters.reduce(
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
export const selectCharactersStatistics = createSelector(
  [ selectCharactersMap, selectCells ],
  (charactersStatistics, cells) => Object.values(cells.reduce(reduceCellStatistics, charactersStatistics))
);
export const selectNumberOfRemainingCharacters = createSelector(
  [ selectCharactersStatistics ],
  getNumberOfRemainingCharacters
);
