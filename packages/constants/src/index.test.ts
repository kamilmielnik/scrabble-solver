import { BONUS_CHARACTER, BONUS_WORD, COMMA_ARABIC, COMMA_LATIN, CONSONANTS, VOWELS } from './index';

describe('BONUS_CHARACTER and BONUS_WORD', () => {
  it('are distinct strings, so a serialized bonus dispatches to exactly one bonus class', () => {
    expect(BONUS_CHARACTER).toBeString();
    expect(BONUS_WORD).toBeString();
    expect(BONUS_CHARACTER).not.toBe(BONUS_WORD);
  });
});

describe('COMMA_ARABIC and COMMA_LATIN', () => {
  it('are distinct single characters', () => {
    expect(COMMA_ARABIC).toHaveLength(1);
    expect(COMMA_LATIN).toHaveLength(1);
    expect(COMMA_ARABIC).not.toBe(COMMA_LATIN);
  });
});

describe.each([
  ['CONSONANTS', CONSONANTS],
  ['VOWELS', VOWELS],
])('%s', (_name, letters) => {
  it('holds only single lower-case letters', () => {
    expect(letters.filter((letter) => !/^\p{Ll}$/u.test(letter))).toEqual([]);
  });

  it('has no duplicates', () => {
    expect(new Set(letters).size).toBe(letters.length);
  });
});

describe('CONSONANTS and VOWELS', () => {
  it('share no letter, so a tile is never counted or grouped as both', () => {
    expect(CONSONANTS.filter((letter) => VOWELS.includes(letter))).toEqual([]);
  });
});
