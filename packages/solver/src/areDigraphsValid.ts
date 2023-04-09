import { Config, Pattern } from '@scrabble-solver/types';

const areDigraphsValid = (config: Config, pattern: Pattern): boolean => {
  const { twoCharacterTiles } = config;
  const { cells } = pattern;

  for (let index = 0; index < cells.length - 1; ++index) {
    const current = cells[index];
    const next = cells[index + 1];
    const digraphCandidate = current.tile.character + next.tile.character;

    if (twoCharacterTiles.includes(digraphCandidate)) {
      return false;
    }
  }

  return true;
};

export default areDigraphsValid;
