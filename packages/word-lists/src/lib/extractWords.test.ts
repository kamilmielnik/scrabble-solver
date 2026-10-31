import { describe, expect, it } from 'bun:test';

import { extractWords } from './extractWords';

describe('extractWords', () => {
  it('splits a file on line feeds', () => {
    expect(extractWords('aa\nab\nad', 'en-US')).toEqual(['aa', 'ab', 'ad']);
  });

  it('splits a file on Windows line endings', () => {
    expect(extractWords('aa\r\nab\r\nad\r\n', 'en-US')).toEqual(['aa', 'ab', 'ad']);
  });

  it('handles a file mixing both kinds of line endings', () => {
    expect(extractWords('aa\r\nab\nad\r\n', 'en-US')).toEqual(['aa', 'ab', 'ad']);
  });

  it('ignores blank lines between words', () => {
    expect(extractWords('aa\n\n\nab\n   \nad\n', 'en-US')).toEqual(['aa', 'ab', 'ad']);
  });

  it('trims whitespace around words', () => {
    expect(extractWords('aa\n  ab\nad\t\n', 'en-US')).toEqual(['aa', 'ab', 'ad']);
  });

  it('skips blank lines before the first word', () => {
    expect(extractWords('\n\r\n   \naa\nab', 'en-US')).toEqual(['aa', 'ab']);
  });

  it('lower-cases words', () => {
    expect(extractWords('AA\nAb\n', 'en-US')).toEqual(['aa', 'ab']);
  });

  it('lower-cases letters with diacritics', () => {
    expect(extractWords('aa\nŻÓŁĆ\n', 'pl-PL')).toEqual(['aa', 'żółć']);
  });

  it('keeps the order and the duplicates of the file', () => {
    expect(extractWords('aa\nzz\nab\nzz\n', 'en-US')).toEqual(['aa', 'zz', 'ab', 'zz']);
  });

  it('lower-cases I to dotless ı and İ to i in Turkish', () => {
    expect(extractWords('aa\nKIZ\nİKİ\n', 'tr-TR')).toEqual(['aa', 'kız', 'iki']);
  });

  it('keeps the first word of a sorted list that does not start with a double letter', () => {
    expect(extractWords('ab\nad\n', 'en-US')).toEqual(['ab', 'ad']);
  });

  it('keeps every line, because no word list has a header', () => {
    expect(extractWords('Header\naa\ntwo words\n', 'en-US')).toEqual(['header', 'aa', 'two words']);
  });

  it.each([
    ['an empty file', ''],
    ['a file of blank lines', '\n  \n\t\n'],
  ])('fails with a descriptive error for %s', (_description, file) => {
    expect(() => extractWords(file, 'en-US')).toThrow('Cannot find any words in the file');
  });
});
