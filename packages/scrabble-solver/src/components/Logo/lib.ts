import {
  LOGO_PADDING_HORIZONTAL,
  LOGO_PADDING_VERTICAL,
  POINTS,
  POINTS_COLORS,
  TILE_MARGIN,
  TILE_MAX_ROTATE,
  TILE_MAX_SCATTER,
  TILE_SIZE,
  VERSION_TILE_SIZE,
} from './constants';

const randomize = (value: number, maxChange: number): number => value + maxChange * 2 * (0.5 - Math.random());

export const createTiles = (name: string) => {
  const words = name.split(' ');
  const rows = words.map((word, rowIndex) => {
    const characters = word.split('');
    return characters.map((character, cellIndex) => createTile(character, rowIndex, cellIndex));
  });
  const tiles = rows.flat();
  return tiles;
};

const createTile = (character: string, rowIndex: number, cellIndex: number) => ({
  character,
  color: POINTS_COLORS[POINTS[character]],
  points: POINTS[character],
  size: TILE_SIZE,
  transform: `rotate(${randomize(0, TILE_MAX_ROTATE)}, ${getX(cellIndex) + TILE_SIZE / 2}, ${getY(0) + TILE_SIZE / 2})`,
  x: randomize(getX(cellIndex, rowIndex), TILE_MAX_SCATTER),
  y: randomize(getY(rowIndex), TILE_MAX_SCATTER),
});

export const getLongestWord = (words: string[]): string => {
  return words.reduce((result, word) => (word.length > result.length ? word : result), '');
};

export const getViewbox = (name: string) => {
  const words = name.split(' ');
  const width = getLongestWord(words).length * (TILE_SIZE + TILE_MARGIN);
  return `0 0 ${width} ${2 * TILE_SIZE + TILE_MARGIN}`;
};

export const getX = (index: number, rowIndex: number): number =>
  LOGO_PADDING_HORIZONTAL + index * (TILE_SIZE + TILE_MARGIN);

export const getY = (index: number): number => LOGO_PADDING_VERTICAL + index * (TILE_SIZE + TILE_MARGIN);
