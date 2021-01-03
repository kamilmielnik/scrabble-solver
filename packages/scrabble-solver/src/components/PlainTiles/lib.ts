import { literaki } from '@scrabble-solver/configs';

import {
  COLOR_DEFAULT,
  PADDING_HORIZONTAL,
  PADDING_VERTICAL,
  POINTS_COLORS,
  TILE_MARGIN,
  TILE_MAX_ROTATE,
  TILE_MAX_SCATTER,
  TILE_SIZE,
} from './constants';

interface CreateTileOptions {
  cellIndex: number;
  character: string;
  color?: string;
  rowIndex: number;
  showPoints?: boolean;
}

interface CreateTilesOptions {
  color?: string;
  content: string[][];
  showPoints?: boolean;
}

const randomize = (value: number, maxChange: number): number => value + maxChange * 2 * (0.5 - Math.random());

export const createTiles = ({ color, content, showPoints }: CreateTilesOptions) => {
  const rows = content.map((words, rowIndex) => {
    return words.map((word, wordIndex) => {
      const cellOffset = words.slice(0, wordIndex).reduce((result, { length }) => result + length + ' '.length, 0);
      const characters = word.split('');

      return characters.map((character, cellIndex) => {
        return createTile({
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

const createTile = ({ cellIndex, character, color, rowIndex, showPoints }: CreateTileOptions) => {
  const configPoints = literaki['en-US'].getCharacterPoints(character.toLowerCase());
  const points = showPoints ? configPoints : undefined;

  return {
    character,
    color: color ? color : typeof configPoints === 'number' ? POINTS_COLORS[configPoints] : COLOR_DEFAULT,
    points,
    size: TILE_SIZE,
    transform: `rotate(${randomize(0, TILE_MAX_ROTATE)}, ${getX(cellIndex) + TILE_SIZE / 2}, ${
      getY(0) + TILE_SIZE / 2
    })`,
    x: randomize(getX(cellIndex), TILE_MAX_SCATTER),
    y: randomize(getY(rowIndex), TILE_MAX_SCATTER),
  };
};

export const getViewbox = (content: string[][]) => {
  const longestRowLength = content.reduce((result, words) => {
    const wordsLength = words.reduce((sum, word) => sum + word.length, 0);
    const rowLength = wordsLength + Math.max(words.length - 1, 0);
    return Math.max(result, rowLength);
  }, 0);
  const width = longestRowLength * (TILE_SIZE + TILE_MARGIN) - (longestRowLength === 0 ? 0 : TILE_MARGIN);
  const height = content.length * (TILE_SIZE + TILE_MARGIN) - (content.length === 0 ? 0 : TILE_MARGIN);

  return `0 0 ${width} ${height}`;
};

export const getX = (index: number): number => PADDING_HORIZONTAL + index * (TILE_SIZE + TILE_MARGIN);

export const getY = (index: number): number => PADDING_VERTICAL + index * (TILE_SIZE + TILE_MARGIN);
