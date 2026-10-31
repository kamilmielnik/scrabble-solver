import { describe, expect, it } from 'bun:test';

import { normalizeDefinition } from './normalizeDefinition';

describe('normalizeDefinition', () => {
  describe('html tags', () => {
    it.each([
      ['<i>foo</i> bar', 'foo bar'],
      ['<span class="x">foo</span> bar', 'foo bar'],
      ['foo<br>bar', 'foobar'],
      ['<div><p>foo</p></div>', 'foo'],
    ])('strips the plain tags of %j', (input, expected) => {
      expect(normalizeDefinition(input)).toBe(expected);
    });

    it.each([
      ['<a href="/wiki/foo">foo</a> bar', '"foo" bar'],
      ['<b>foo</b> bar', '"foo" bar'],
      ['<em>foo</em> bar', '"foo" bar'],
    ])('turns the emphasis tags of %j into quotes', (input, expected) => {
      expect(normalizeDefinition(input)).toBe(expected);
    });

    it('drops a definition made of tags only', () => {
      expect(normalizeDefinition('<br>')).toBe('');
      expect(normalizeDefinition('<b></b>')).toBe('');
    });

    it('keeps a "<" that does not open a tag', () => {
      expect(normalizeDefinition('a < b')).toBe('a < b');
    });
  });

  describe('markers', () => {
    it.each([
      ['(1.2) foo', 'foo'],
      ['(10.25) foo', 'foo'],
      ['(1.2)    foo', 'foo'],
      ['(1.2)\nfoo', 'foo'],
      ['(1.2) (1.3) foo', 'foo'],
    ])('removes the leading marker of %j', (input, expected) => {
      expect(normalizeDefinition(input)).toBe(expected);
    });

    it.each(['foo (1.2) bar', '(1.2)foo', '(1) foo', '(1.2.3) foo'])(
      'keeps %j, which has no leading marker',
      (input) => {
        expect(normalizeDefinition(input)).toBe(input);
      },
    );
  });

  describe('quotes', () => {
    it('moves a period out of a closing quote', () => {
      expect(normalizeDefinition('foo "bar."')).toBe('foo "bar".');
    });

    it('moves a period out of an emphasis tag', () => {
      expect(normalizeDefinition('<b>foo.</b>')).toBe('"foo".');
    });

    it('keeps a period that follows a closing quote', () => {
      expect(normalizeDefinition('"foo".')).toBe('"foo".');
    });
  });

  describe('line breaks', () => {
    it('converts a windows line break to a unix one', () => {
      expect(normalizeDefinition('foo\r\nbar')).toBe('foo\nbar');
    });

    it('keeps the line breaks that separate sub-definitions', () => {
      expect(normalizeDefinition('foo\n1. bar\n\n2. baz')).toBe('foo\n1. bar\n\n2. baz');
    });
  });

  describe('whitespace', () => {
    it.each([
      ['a tab', 'foo\tbar'],
      ['repeated tabs', 'foo\t\tbar'],
      ['repeated spaces', 'foo    bar'],
      ['a lone carriage return', 'foo\rbar'],
      ['a form feed', 'foo\fbar'],
      ['a non-breaking space', 'foo bar'],
      ['a thin space', 'foo bar'],
      ['an ideographic space', 'foo　bar'],
      ['mixed whitespace', 'foo \t  bar'],
    ])('reduces %s to one space', (_, input) => {
      expect(normalizeDefinition(input)).toBe('foo bar');
    });

    it('trims the whitespace at both ends, line breaks included', () => {
      expect(normalizeDefinition('\n\t  foo  \n')).toBe('foo');
    });
  });

  describe('leading and trailing symbols', () => {
    it.each([
      ['foo:', 'foo'],
      ['foo :', 'foo'],
      ['foo::', 'foo'],
      [':foo', 'foo'],
      [': foo', 'foo'],
      ['::foo::', 'foo'],
    ])('removes the outer colons of %j', (input, expected) => {
      expect(normalizeDefinition(input)).toBe(expected);
    });

    it('keeps a colon inside the definition', () => {
      expect(normalizeDefinition('foo: bar')).toBe('foo: bar');
    });

    it.each(['foo.', 'foo!', 'foo?', 'foo;', 'foo)'])('keeps the trailing punctuation of %j', (input) => {
      expect(normalizeDefinition(input)).toBe(input);
    });
  });

  describe('commas', () => {
    it.each([
      ['foo , bar', 'foo, bar'],
      ['foo   ,   bar', 'foo, bar'],
      ['foo\n,\nbar', 'foo, bar'],
      [',foo', 'foo'],
      [', foo', 'foo'],
      ['foo,', 'foo'],
      ['foo ,', 'foo'],
    ])('tidies the commas of %j', (input, expected) => {
      expect(normalizeDefinition(input)).toBe(expected);
    });

    it.each(['foo, bar', 'foo,bar'])('keeps %j as it is', (input) => {
      expect(normalizeDefinition(input)).toBe(input);
    });
  });

  describe('definitions without words', () => {
    it.each(['', ' ', '\n', '\t', '...', '---', '()', '"."', ',', ':', '  ,  ', '→'])('empties %j', (input) => {
      expect(normalizeDefinition(input)).toBe('');
    });

    it.each(['123', '_'])('keeps %j, which counts as a word', (input) => {
      expect(normalizeDefinition(input)).toBe(input);
    });

    it.each(['żółć', 'şığ', 'گچ'])('keeps %j, written only in letters outside a-z', (input) => {
      expect(normalizeDefinition(input)).toBe(input);
    });
  });

  describe('unicode', () => {
    it.each([
      ['Polish', 'zażółć gęślą jaźń'],
      ['Turkish', 'ılık, İstanbul'],
      ['Romanian', 'țară și câmpie'],
      ['German', 'Größe; Maß'],
      ['Arabic script', 'كتاب'],
      ['Persian script with an Arabic letter', 'کتاب'],
    ])('keeps %s text as it is', (_, input) => {
      expect(normalizeDefinition(input)).toBe(input);
    });

    it('keeps combining marks in their original unicode form', () => {
      expect(normalizeDefinition('café')).toBe('café');
    });
  });

  describe('combined rules', () => {
    it('applies the rules until nothing changes', () => {
      expect(normalizeDefinition(' : , foo , : ')).toBe('foo');
    });

    it('cleans up a realistic definition', () => {
      expect(normalizeDefinition('(1.2) <b>foo.</b>\tbar\r\nbaz , qux:')).toBe('"foo". bar\nbaz, qux');
    });

    it.each(['"foo". bar\nbaz, qux', 'foo', 'zażółć', '(1) foo', ''])('leaves the normalized %j unchanged', (input) => {
      expect(normalizeDefinition(normalizeDefinition(input))).toBe(normalizeDefinition(input));
    });
  });
});
