import { BLANK } from '@scrabble-solver/constants';
import { Tile } from '@scrabble-solver/types';

import { Rack } from 'types';

interface CharacterTilePair {
  character: string | null;
  tile: Tile | null;
}

export const zipCharactersAndTiles = (characters: Rack, tiles: Tile[]): CharacterTilePair[] => {
  let remainingTiles = [...tiles];

  return characters.map((character) => {
    const index = remainingTiles.findIndex((tile) =>
      character === BLANK ? tile.isBlank : character === tile.character,
    );

    if (index >= 0) {
      const tile = remainingTiles[index];
      remainingTiles = [...remainingTiles.slice(0, index), ...remainingTiles.slice(index + 1)];

      return { character, tile };
    }

    return { character, tile: null };
  });
};
