import { Tile } from '@scrabble-solver/types';

const generateBlankTilesPermutations = (alphabet: string[], tiles: Tile[]): Tile[][] => {
  const firstBlankIndex = tiles.findIndex(({ character, isBlank }) => isBlank && !alphabet.includes(character));

  if (firstBlankIndex === -1) {
    return [tiles];
  }

  const remainingTiles = tiles.slice(0, firstBlankIndex).concat(tiles.slice(firstBlankIndex + 1));

  return alphabet.reduce<Tile[][]>((permutations, character) => {
    const newTile = new Tile({ character, isBlank: true });
    const newTiles = [...remainingTiles, newTile];

    return permutations.concat(generateBlankTilesPermutations(alphabet, newTiles));
  }, []);
};

export default generateBlankTilesPermutations;
