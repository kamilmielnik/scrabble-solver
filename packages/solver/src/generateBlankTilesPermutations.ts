import { Config, Tile } from '@scrabble-solver/types';

const generateBlankTilesPermutations = (config: Config, tiles: Tile[]): Tile[][] => {
  const firstBlankIndex = tiles.findIndex(({ character, isBlank }) => isBlank && !config.hasCharacter(character));

  if (firstBlankIndex === -1) {
    return [tiles];
  }

  const remainingTiles = tiles.slice(0, firstBlankIndex).concat(tiles.slice(firstBlankIndex + 1));

  return config.alphabet.flatMap((character) => {
    const newTile = new Tile({ character, isBlank: true });
    const newTiles = [...remainingTiles, newTile];

    return generateBlankTilesPermutations(config, newTiles);
  });
};

export default generateBlankTilesPermutations;
