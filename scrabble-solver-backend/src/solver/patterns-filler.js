import { Tile } from 'scrabble-solver-commons/models';

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
    const onPatternFound = (pattern) => patterns.push(pattern);
    this.generateBlankTilesPermutations(tiles).forEach((tilesPermutation) =>
      this.fillPattern(pattern, String(pattern), tilesPermutation, onPatternFound)
    );
    return patterns;
  }

  fillPattern(pattern, word, tiles, onPatternFound) {
    const indexOfFirstCellWithoutTile = pattern.getIndexOfFirstCellWithoutTile();
    if (indexOfFirstCellWithoutTile === -1) {
      if (this.canAddPattern(pattern, word)) {
        onPatternFound(pattern.clone());
      }
    } else {
      tiles.forEach((tile, index) => {
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
        } else if (this.collection.hasMore(newWordPrefix)) {
          this.fillPattern(pattern, newWord, remainingTiles, onPatternFound);
        }
        pattern.cells[indexOfFirstCellWithoutTile].tile = previousTile;
      });
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

    if (firstBlankIndex !== -1) {
      const remainingTiles = tiles.slice(0, firstBlankIndex).concat(tiles.slice(firstBlankIndex + 1));
      return this.config.alphabet.reduce((permutations, character) => {
        const newTile = new Tile({ character, isBlank: true });
        const newTiles = [...remainingTiles, newTile];
        return permutations.concat(this.generateBlankTilesPermutations(newTiles));
      }, []);
    }

    return [tiles];
  }
}

export default PatternsFiller;
