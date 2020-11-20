import { Tile } from '@scrabble-solver/models';

class PatternsFiller {
  constructor(config, collection) {
    this.config = config;
    this.collection = collection;
  }

  fill(pattern, tiles) {
    const patterns = [];

    if (pattern.getNumberOfEmptyCells() > tiles.length) {
      return [];
    }

    const onPatternFound = (newPattern) => patterns.push(newPattern);
    const tilesPermutations = this.generateBlankTilesPermutations(tiles);

    for (let index = 0; index < tilesPermutations.length; ++index) {
      const tilesPermutation = tilesPermutations[index];
      this.fillPattern(pattern, String(pattern), tilesPermutation, onPatternFound);
    }

    return patterns;
  }

  fillPattern(pattern, word, tiles, onPatternFound) {
    const indexOfFirstCellWithoutTile = pattern.getIndexOfFirstCellWithoutTile();
    if (indexOfFirstCellWithoutTile === -1) {
      if (this.canAddPattern(pattern, word)) {
        onPatternFound(pattern.clone());
      }
    } else {
      for (let index = 0; index < tiles.length; ++index) {
        const tile = tiles[index];
        const remainingTiles = tiles.slice(0, index).concat(tiles.slice(index + 1));
        const previousTile = pattern.cells[indexOfFirstCellWithoutTile].tile;
        pattern.cells[indexOfFirstCellWithoutTile].tile = tile;
        const indexOfNextCellWithoutTile = pattern.getIndexOfFirstCellWithoutTile();
        const newWordPrefix = word.substring(0, indexOfFirstCellWithoutTile) + tile.character;
        const newWord = newWordPrefix + word.substring(indexOfFirstCellWithoutTile + 1);
        if (indexOfNextCellWithoutTile === -1) {
          if (this.canAddPattern(pattern, newWord)) {
            onPatternFound(pattern.clone());
          }
        } else if (this.collection.hasPrefix(newWordPrefix)) {
          this.fillPattern(pattern, newWord, remainingTiles, onPatternFound);
        }
        pattern.cells[indexOfFirstCellWithoutTile].tile = previousTile;
      }
    }
  }

  canAddPattern(pattern, word) {
    return (
      this.collection.has(word) &&
      pattern
        .getCollisions()
        .map(String)
        .every((collision) => this.collection.has(collision))
    );
  }

  generateBlankTilesPermutations(tiles) {
    const { alphabet } = this.config;
    const firstBlankIndex = tiles.findIndex(({ character, isBlank }) => isBlank && !alphabet.includes(character));

    if (firstBlankIndex === -1) {
      return [tiles];
    }

    const remainingTiles = tiles.slice(0, firstBlankIndex).concat(tiles.slice(firstBlankIndex + 1));
    return this.config.alphabet.reduce((permutations, character) => {
      const newTile = new Tile({ character, isBlank: true });
      const newTiles = [...remainingTiles, newTile];
      return permutations.concat(this.generateBlankTilesPermutations(newTiles));
    }, []);
  }
}

export default PatternsFiller;
