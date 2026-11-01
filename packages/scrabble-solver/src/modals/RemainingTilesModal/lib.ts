import { BLANK } from '@scrabble-solver/constants';
import { type Locale, isConsonant, isVowel } from '@scrabble-solver/types';

import { type RemainingTile, type RemainingTilesGroup } from '@/types';

export const getRemainingTilesGroups = (remainingTiles: RemainingTile[], locale: Locale): RemainingTilesGroup[] => {
  const consonants = remainingTiles.filter((tile) => isConsonant(tile.character, locale));
  const vowels = remainingTiles.filter((tile) => isVowel(tile.character, locale));
  const other = remainingTiles.filter((tile) => isOther(tile, locale));
  const digraphs = remainingTiles.filter(isDigraph);
  const blanks = remainingTiles.filter(isBlank);
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
    remainingCount: getRemainingTilesCount(digraphs),
    tiles: digraphs,
    translationKey: 'common.digraphs',
    totalCount: getTotalTilesCount(digraphs),
  });

  groups.push({
    remainingCount: getRemainingTilesCount(other),
    tiles: other,
    translationKey: 'common.tiles',
    totalCount: getTotalTilesCount(other),
  });

  groups.push({
    remainingCount: getRemainingTilesCount(blanks),
    tiles: blanks,
    translationKey: 'common.blanks',
    totalCount: getTotalTilesCount(blanks),
  });

  return groups.filter(({ tiles, totalCount }) => totalCount > 0 || tiles.some(isOverused));
};

function isOverused({ count, usedCount }: RemainingTile): boolean {
  return typeof count !== 'undefined' && usedCount > count;
}

function isDigraph(tile: RemainingTile): boolean {
  return tile.character.length > 1;
}

const isBlank = (tile: RemainingTile): boolean => tile.character === BLANK;

function isOther(tile: RemainingTile, locale: Locale): boolean {
  return !isConsonant(tile.character, locale) && !isVowel(tile.character, locale) && !isBlank(tile) && !isDigraph(tile);
}

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
