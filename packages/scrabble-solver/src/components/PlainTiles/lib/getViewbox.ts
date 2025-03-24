import { PLAIN_TILES_TILE_MARGIN, PLAIN_TILES_TILE_SIZE } from 'parameters';

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
