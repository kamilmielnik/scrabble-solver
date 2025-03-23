import { BLANK } from '@scrabble-solver/constants';
import { Config, Locale } from '@scrabble-solver/types';
import { transliterate } from 'transliteration';

const transliteratePerLocale: Record<Locale, (word: string) => string> = {
  [Locale.DE_DE]: (word) => word,
  [Locale.EN_GB]: (word) => word,
  [Locale.EN_US]: (word) => word,
  [Locale.ES_ES]: (word) => transliterate(word, { ignore: ['ñ'] }),
  [Locale.FA_IR]: (word) => word,
  [Locale.FR_FR]: (word) => transliterate(word),
  [Locale.PL_PL]: (word) => word,
  [Locale.RO_RO]: (word) => transliterate(word),
  [Locale.TR_TR]: (word) => word,
};

const extractCharacters = (config: Config, value: string): string[] => {
  let index = 0;
  const characters: string[] = [];
  const localeTransliterate = transliteratePerLocale[config.locale];
  const valueLowercase = localeTransliterate(value.toLocaleLowerCase(config.locale));

  while (index < valueLowercase.length) {
    const character = valueLowercase[index];
    const nextCharacter = valueLowercase[index + 1];
    const digraph = `${character}${nextCharacter}`;

    if (config.twoCharacterTiles.includes(digraph)) {
      characters.push(digraph);
      index += digraph.length;
    } else if (config.hasCharacter(character) || character === BLANK) {
      characters.push(character);
      ++index;
    } else {
      ++index;
    }
  }

  return characters;
};

export default extractCharacters;
