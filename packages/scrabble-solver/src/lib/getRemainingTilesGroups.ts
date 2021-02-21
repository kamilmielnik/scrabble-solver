import { BLANK, CONSONANTS, VOWELS } from '@scrabble-solver/constants';

import { RemainingTile, RemainingTilesGroup } from 'types';

import getRemainingTilesCount from './getRemainingTilesCount';
import getTotalRemainingTilesCount from './getTotalRemainingTilesCount';

export const getRemainingTilesGroups = (remainingTiles: RemainingTile[]): RemainingTilesGroup[] => {
  const consonants = remainingTiles.filter(({ character }) => CONSONANTS.includes(character));
  const vowels = remainingTiles.filter(({ character }) => VOWELS.includes(character));
  const blanks = remainingTiles.filter(({ character }) => character === BLANK);

  return [
    {
      remainingCount: getRemainingTilesCount(vowels),
      tiles: vowels,
      translationKey: 'common.vowels',
      totalCount: getTotalRemainingTilesCount(vowels),
    },
    {
      remainingCount: getRemainingTilesCount(consonants),
      tiles: consonants,
      translationKey: 'common.consonants',
      totalCount: getTotalRemainingTilesCount(consonants),
    },
    {
      remainingCount: getRemainingTilesCount(blanks),
      tiles: blanks,
      translationKey: 'common.blanks',
      totalCount: getTotalRemainingTilesCount(blanks),
    },
  ];
};

export default getRemainingTilesGroups;
