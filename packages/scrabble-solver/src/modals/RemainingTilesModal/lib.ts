import { BLANK, CONSONANTS, VOWELS } from '@scrabble-solver/constants';

import { type RemainingTile, type RemainingTilesGroup } from 'types';

export const getRemainingTilesGroups = (remainingTiles: RemainingTile[]): RemainingTilesGroup[] => {
  const consonants = remainingTiles.filter(isConsonant);
  const vowels = remainingTiles.filter(isVowel);
  const other = remainingTiles.filter(isOther);
  const groups: RemainingTilesGroup[] = [];

  groups.push({
    remainingCount: getRemainingTilesCount(vowels),
    tiles: vowels,
    translationKey: 'common.vowels',
    totalCount: getTotalTilesCount(vowels),
  });

  groups.push({
    remainingCount: getRemainingTilesCount(consonants),
    tiles: consonants,
    translationKey: 'common.consonants',
    totalCount: getTotalTilesCount(consonants),
  });

  groups.push({
    remainingCount: getRemainingTilesCount(other),
    tiles: other,
    translationKey: 'common.tiles',
    totalCount: getTotalTilesCount(other),
  });

  const twoCharacterTiles = remainingTiles.filter(isTwoCharacter);
  const blanks = remainingTiles.filter(isBlank);

  groups.push({
    remainingCount: getRemainingTilesCount(twoCharacterTiles),
    tiles: twoCharacterTiles,
    translationKey: 'common.two-letter-tiles',
    totalCount: getTotalTilesCount(twoCharacterTiles),
  });

  groups.push({
    remainingCount: getRemainingTilesCount(blanks),
    tiles: blanks,
    translationKey: 'common.blanks',
    totalCount: getTotalTilesCount(blanks),
  });

  return groups.filter(({ totalCount }) => totalCount > 0);
};

const isConsonant = (tile: RemainingTile): boolean => CONSONANTS.includes(tile.character);

const isVowel = (tile: RemainingTile): boolean => VOWELS.includes(tile.character);

const isTwoCharacter = (tile: RemainingTile): boolean => tile.character.length === 2;

const isBlank = (tile: RemainingTile): boolean => tile.character === BLANK;

const isOther = (tile: RemainingTile) =>
  !isConsonant(tile) && !isVowel(tile) && !isBlank(tile) && !isTwoCharacter(tile);

const getRemainingTilesCount = (remainingTiles: RemainingTile[]): number => {
  return remainingTiles.reduce((sum, { count, usedCount }) => {
    if (typeof count === 'undefined') {
      return sum;
    }

    return sum + count - usedCount;
  }, 0);
};

const getTotalTilesCount = (remainingTiles: RemainingTile[]): number => {
  return remainingTiles.reduce((sum, { count }) => {
    if (typeof count === 'undefined') {
      return sum;
    }

    return sum + count;
  }, 0);
};
