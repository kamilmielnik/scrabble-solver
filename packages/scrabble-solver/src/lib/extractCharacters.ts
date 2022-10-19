import { BLANK } from '@scrabble-solver/constants';
import { Config } from '@scrabble-solver/types';

const extractCharacters = (config: Config, value: string): string[] => {
  let index = 0;
  const characters: string[] = [];

  while (index < value.length) {
    const character = value[index];
    const nextCharacter = value[index + 1];
    const twoCharacterTileCandidate = `${character}${nextCharacter}`;

    if (config.twoCharacterTiles.includes(twoCharacterTileCandidate)) {
      characters.push(twoCharacterTileCandidate);
      ++index;
    } else if (config.hasCharacter(character) || character === BLANK) {
      characters.push(character);
    }

    ++index;
  }

  return characters;
};

export default extractCharacters;
