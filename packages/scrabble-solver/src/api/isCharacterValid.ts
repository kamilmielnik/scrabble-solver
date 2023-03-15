const TWO_TILE_CHARACTER_LENGTH = 2;
const MAX_CHARACTER_LENGTH = TWO_TILE_CHARACTER_LENGTH;

const isCharacterValid = (character: string): boolean => {
  /*
   * We could be strict here and check whether config.hasCharacter(character) || character === BLANK
   * but since this case won't really affect/break solving, we don't need to worry about it.
   * It's better to display an empty state than error state in UI, so this is a sanity check only.
   */
  return character.length !== 0 && character.length <= MAX_CHARACTER_LENGTH;
};

export default isCharacterValid;
