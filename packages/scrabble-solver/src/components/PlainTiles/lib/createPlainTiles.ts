import { CreatePlainTilesOptions, PlainTile } from '../types';

import { createPlainTile } from './createPlainTile';

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
