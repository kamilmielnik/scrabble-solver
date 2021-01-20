import { BLANK } from '@scrabble-solver/constants';
import { Tile } from '@scrabble-solver/types';

interface CharacterTilePair {
  character: string | null;
  tile: Tile | null;
}

const zipCharactersAndTiles = (characters: (string | null)[], tiles: Tile[]): CharacterTilePair[] => {
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

export default zipCharactersAndTiles;
