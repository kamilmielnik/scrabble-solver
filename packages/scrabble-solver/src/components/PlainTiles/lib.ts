import { getConfig } from '@scrabble-solver/configs';
import { Game, Locale } from '@scrabble-solver/types';

import {
  PLAIN_TILES_COLOR_DEFAULT,
  PLAIN_TILES_POINTS_COLORS,
  PLAIN_TILES_TILE_MARGIN,
  PLAIN_TILES_TILE_SIZE,
} from '@/parameters';

import type { CreatePlainTileOptions, CreatePlainTilesOptions, PlainTile } from './types';

export const createPlainTiles = ({ color, content, showPoints }: CreatePlainTilesOptions): PlainTile[] => {
  const rows = content.map((words, rowIndex) => {
    return words.map((word, wordIndex) => {
      const cellOffset = words.slice(0, wordIndex).reduce((result, { length }) => result + length + ' '.length, 0);
      const characters = word.split('');

      return characters.map((character, cellIndex) => {
        return createPlainTile({
          cellIndex: cellOffset + cellIndex,
          character,
          color,
          rowIndex,
          showPoints,
        });
      });
    });
  });

  const tiles = rows.flat(2);
  return tiles;
};

export const createPlainTile = ({
  cellIndex,
  character,
  color,
  rowIndex,
  showPoints,
}: CreatePlainTileOptions): PlainTile => {
  const configPoints = getConfig(Game.Literaki, Locale.EN_US).getCharacterPoints(character.toLowerCase());
  const points = showPoints ? configPoints : undefined;
  const defaultColor =
    typeof configPoints === 'number' ? PLAIN_TILES_POINTS_COLORS[configPoints] : PLAIN_TILES_COLOR_DEFAULT;

  return {
    character,
    color: color || defaultColor,
    points,
    size: PLAIN_TILES_TILE_SIZE,
    x: getOffset(cellIndex),
    y: getOffset(rowIndex),
  };
};

export const getViewbox = (content: string[][]): string => {
  const longestRowLength = content.reduce((result, words) => {
    const wordsLength = words.reduce((sum, word) => sum + word.length, 0);
    const rowLength = wordsLength + Math.max(words.length - 1, 0);
    return Math.max(result, rowLength);
  }, 0);
  const width =
    longestRowLength * (PLAIN_TILES_TILE_SIZE + PLAIN_TILES_TILE_MARGIN) -
    (longestRowLength === 0 ? 0 : PLAIN_TILES_TILE_MARGIN);
  const height =
    content.length * (PLAIN_TILES_TILE_SIZE + PLAIN_TILES_TILE_MARGIN) -
    (content.length === 0 ? 0 : PLAIN_TILES_TILE_MARGIN);

  return `0 0 ${width} ${height}`;
};

const getOffset = (index: number): number => {
  return index * (PLAIN_TILES_TILE_SIZE + PLAIN_TILES_TILE_MARGIN);
};
