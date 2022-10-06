import { Trie } from '@kamilmielnik/trie';
import { EMPTY_CELL } from '@scrabble-solver/constants';
import { Config, Pattern, Tile } from '@scrabble-solver/types';

class PatternsFiller {
  private readonly trie: Trie;

  private readonly config: Config;

  constructor(config: Config, trie: Trie) {
    this.config = config;
    this.trie = trie;
  }

  public fill(pattern: Pattern, tiles: Tile[]): Pattern[] {
    const patterns: Pattern[] = [];

    if (pattern.getNumberOfEmptyCells() > tiles.length) {
      return [];
    }

    const onPatternFound = (newPattern: Pattern) => patterns.push(newPattern);
    const tilesPermutations = this.generateBlankTilesPermutations(tiles);

    for (let index = 0; index < tilesPermutations.length; ++index) {
      const tilesPermutation = tilesPermutations[index];
      this.fillPattern(pattern, pattern.toString(), tilesPermutation, onPatternFound);
    }

    return patterns;
  }

  public fillPattern(
    pattern: Pattern,
    word: string,
    tiles: Tile[],
    onPatternFound: (newPattern: Pattern) => void,
  ): void {
    const indexOfFirstCellWithoutTile = pattern.getIndexOfFirstCellWithoutTile();

    if (indexOfFirstCellWithoutTile === -1) {
      if (this.canAddPattern(pattern, word)) {
        onPatternFound(pattern.clone());
      }
    } else {
      for (let index = 0; index < tiles.length; ++index) {
        const tile = tiles[index];
        const previousTile = pattern.cells[indexOfFirstCellWithoutTile].tile;
        pattern.cells[indexOfFirstCellWithoutTile].tile = tile;
        const indexOfNextCellWithoutTile = pattern.getIndexOfFirstCellWithoutTile();
        const indexOfFirstEmptyLetter = word.indexOf(EMPTY_CELL);
        const newWordPrefix = word.substring(0, indexOfFirstEmptyLetter) + tile.character;
        const newWord = newWordPrefix + word.substring(indexOfFirstEmptyLetter + 1);
        if (indexOfNextCellWithoutTile === -1) {
          if (this.canAddPattern(pattern, newWord)) {
            onPatternFound(pattern.clone());
          }
        } else if (this.trie.hasPrefix(newWordPrefix)) {
          tiles.splice(index, 1);
          this.fillPattern(pattern, newWord, tiles, onPatternFound);
          tiles.splice(index, 0, tile);
        }
        pattern.cells[indexOfFirstCellWithoutTile].tile = previousTile;
      }
    }
  }

  public canAddPattern(pattern: Pattern, word: string): boolean {
    return this.trie.has(word) && pattern.getCollisions().every((collision) => this.trie.has(collision.toString()));
  }

  public generateBlankTilesPermutations(tiles: Tile[]): Tile[][] {
    const { alphabet } = this.config;
    const firstBlankIndex = tiles.findIndex(({ character, isBlank }) => isBlank && !alphabet.includes(character));

    if (firstBlankIndex === -1) {
      return [tiles];
    }

    const remainingTiles = tiles.slice(0, firstBlankIndex).concat(tiles.slice(firstBlankIndex + 1));

    return this.config.alphabet.reduce<Tile[][]>((permutations, character) => {
      const newTile = new Tile({ character, isBlank: true });
      const newTiles = [...remainingTiles, newTile];

      return permutations.concat(this.generateBlankTilesPermutations(newTiles));
    }, []);
  }
}

export default PatternsFiller;
