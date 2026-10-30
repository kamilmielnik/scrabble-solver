import { describe, expect, it } from 'bun:test';

import { findFirstWordIndex } from './findFirstWordIndex';

describe('findFirstWordIndex', () => {
  it('returns 0 when the file starts with a word', () => {
    expect(findFirstWordIndex(['aa', 'ab'], 'en-US')).toBe(0);
  });

  it('accepts a file holding a single word', () => {
    expect(findFirstWordIndex(['aa'], 'en-US')).toBe(0);
  });

  it('skips leading empty lines', () => {
    expect(findFirstWordIndex(['', '', 'aa', 'ab'], 'en-US')).toBe(2);
  });

  it('skips leading lines holding only whitespace', () => {
    expect(findFirstWordIndex(['   ', '\t', 'aa', 'ab'], 'en-US')).toBe(2);
  });

  it('skips header lines containing spaces', () => {
    expect(findFirstWordIndex(['Scrabble word list', 'Version 1.0', 'aa', 'ab'], 'en-US')).toBe(2);
  });

  it('skips header lines containing tabs', () => {
    expect(findFirstWordIndex(['word\tlist', 'aa', 'ab'], 'en-US')).toBe(1);
  });

  it.todo('returns the first line of a sorted list whose first word is not a double letter', () => {
    expect(findFirstWordIndex(['ab', 'ad'], 'en-US')).toBe(0);
  });

  it.todo('skips a single-word header that does not sort before the line after it', () => {
    expect(findFirstWordIndex(['Header', 'aa', 'ab'], 'en-US')).toBe(1);
  });

  it.todo('compares neighbouring lines using the collation of the locale', () => {
    expect(findFirstWordIndex(['zz', 'ää'], 'sv-SE')).toBe(0);
    expect(findFirstWordIndex(['zz', 'ää'], 'de-DE')).toBe(1);
  });

  it.todo('throws when no line can be the first word', () => {
    expect(() => findFirstWordIndex(['', '  ', 'two words'], 'en-US')).toThrow(
      'Cannot find index of the first word in the file',
    );
  });
});
