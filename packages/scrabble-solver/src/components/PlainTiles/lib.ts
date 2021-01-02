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

const randomize = (value: number, maxChange: number): number => value + maxChange * 2 * (0.5 - Math.random());

export const createTiles = (content: string[][]) => {
  const rows = content.map((words, rowIndex) => {
    return words.map((word, wordIndex) => {
      const cellOffset = words.slice(0, wordIndex).reduce((result, { length }) => result + length + ' '.length, 0);
      const characters = word.split('');

      return characters.map((character, cellIndex) => createTile(character, rowIndex, cellOffset + cellIndex));
    });
  });
  const tiles = rows.flat(2);
  return tiles;
};

const createTile = (character: string, rowIndex: number, cellIndex: number) => {
  const points = literaki['en-US'].getCharacterPoints(character.toLowerCase());

  return {
    character,
    color: typeof points === 'number' ? POINTS_COLORS[points] : COLOR_DEFAULT,
    points,
    size: TILE_SIZE,
    transform: `rotate(${randomize(0, TILE_MAX_ROTATE)}, ${getX(cellIndex) + TILE_SIZE / 2}, ${
      getY(0) + TILE_SIZE / 2
    })`,
    x: randomize(getX(cellIndex), TILE_MAX_SCATTER),
    y: randomize(getY(rowIndex), TILE_MAX_SCATTER),
  };
};

export const getLongestWord = (words: string[]): string => {
  return words.reduce((result, word) => (word.length > result.length ? word : result), '');
};

export const getViewbox = (content: string[][]) => {
  const words = content.flat();
  const width = getLongestWord(words).length * (TILE_SIZE + TILE_MARGIN);
  return `0 0 ${width} ${2 * TILE_SIZE + TILE_MARGIN}`;
};

export const getX = (index: number): number => PADDING_HORIZONTAL + index * (TILE_SIZE + TILE_MARGIN);

export const getY = (index: number): number => PADDING_VERTICAL + index * (TILE_SIZE + TILE_MARGIN);
