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

  it('trims whitespace around words after the first one', () => {
    expect(extractWords('aa\n  ab\nad\t\n', 'en-US')).toEqual(['aa', 'ab', 'ad']);
  });

  it('skips header lines before the first word', () => {
    const file = 'Official word list\nVersion 1.0\n\naa\nab\n';

    expect(extractWords(file, 'en-US')).toEqual(['aa', 'ab']);
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

  it.todo('lower-cases I to dotless ı and İ to i in Turkish', () => {
    expect(extractWords('aa\nKIZ\nİKİ\n', 'tr-TR')).toEqual(['aa', 'kız', 'iki']);
  });

  it.todo('keeps the first word of a sorted list that does not start with a double letter', () => {
    expect(extractWords('ab\nad\n', 'en-US')).toEqual(['ab', 'ad']);
  });

  it.todo('drops a single-word header line', () => {
    expect(extractWords('Header\naa\nab\n', 'en-US')).toEqual(['aa', 'ab']);
  });

  it.todo('keeps a first word preceded by a byte order mark', () => {
    expect(extractWords('﻿aa\nab\n', 'en-US')).toEqual(['aa', 'ab']);
  });

  it.todo('fails with a descriptive error for an empty file', () => {
    expect(() => extractWords('', 'en-US')).toThrow('Cannot find index of the first word in the file');
  });

  it.todo('fails with a descriptive error for a file holding no word', () => {
    expect(() => extractWords('two words\n\n', 'en-US')).toThrow('Cannot find index of the first word in the file');
  });
});
