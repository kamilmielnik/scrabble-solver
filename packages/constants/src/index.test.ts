import {
  BLANK,
  BONUS_CHARACTER,
  BONUS_WORD,
  COMMA_ARABIC,
  COMMA_LATIN,
  CONSONANTS,
  EMPTY_CELL,
  NO_BONUS,
  VOWELS,
} from './index';

describe('BLANK', () => {
  it('is the single character the space bar types, so a typed space enters a blank tile', () => {
    expect(BLANK).toBe(' ');
  });
});

describe('EMPTY_CELL', () => {
  it('equals BLANK, so inserting an empty value as BLANK clears the board cell', () => {
    expect(EMPTY_CELL).toBe(BLANK);
  });
});

describe('BONUS_CHARACTER and BONUS_WORD', () => {
  it('are distinct strings, so a serialized bonus dispatches to exactly one bonus class', () => {
    expect(BONUS_CHARACTER).toBeString();
    expect(BONUS_WORD).toBeString();
    expect(BONUS_CHARACTER).not.toBe(BONUS_WORD);
  });
});

describe('NO_BONUS', () => {
  it('has the shape of a bonus value and multiplies neither the character nor the word score', () => {
    expect(NO_BONUS).toEqual({ characterMultiplier: 1, wordMultiplier: 1 });
  });
});

describe('COMMA_ARABIC and COMMA_LATIN', () => {
  it('are distinct single characters', () => {
    expect(COMMA_ARABIC).toHaveLength(1);
    expect(COMMA_LATIN).toHaveLength(1);
    expect(COMMA_ARABIC).not.toBe(COMMA_LATIN);
  });

  it('normalize a word list typed with either comma to one separator', () => {
    const list = 'a،b,c';

    expect(list.replaceAll(COMMA_ARABIC, COMMA_LATIN).split(COMMA_LATIN)).toEqual(['a', 'b', 'c']);
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

  it.each([
    { alphabet: 'basic Latin', consonants: 'bcdfghjklmnpqrstvwxz', vowels: 'aeiouy' },
    { alphabet: 'German', consonants: '', vowels: 'äöü' },
    { alphabet: 'Polish', consonants: 'ćłńśźż', vowels: 'ąęó' },
    { alphabet: 'Spanish', consonants: 'ñ', vowels: '' },
    { alphabet: 'Turkish', consonants: 'çğş', vowels: 'ıöü' },
  ])('classify the $alphabet letters', ({ consonants, vowels }) => {
    expect(findMissing(consonants, CONSONANTS)).toEqual([]);
    expect(findMissing(vowels, VOWELS)).toEqual([]);
  });

  it('keep both Turkish i letters as separate vowels whichever case they were typed in', () => {
    const dotless = 'I'.toLocaleLowerCase('tr-TR');
    const dotted = 'İ'.toLocaleLowerCase('tr-TR');

    expect(dotless).toBe('ı');
    expect(dotted).toBe('i');
    expect(VOWELS).toContain(dotless);
    expect(VOWELS).toContain(dotted);
  });
});

function findMissing(letters: string, list: string[]): string[] {
  return letters.split('').filter((letter) => !list.includes(letter));
}
