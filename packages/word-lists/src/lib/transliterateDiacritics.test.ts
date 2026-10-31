import { describe, expect, it } from 'bun:test';

import { transliterateDiacritics } from './transliterateDiacritics';

describe('transliterateDiacritics', () => {
  it('returns an empty array for no words', () => {
    expect(transliterateDiacritics([])).toEqual([]);
  });

  it.each([
    ['été', 'ete'],
    ['garçon', 'garcon'],
    ['cœur', 'coeur'],
    ['șarpe', 'sarpe'],
    ['țară', 'tara'],
    ['înger', 'inger'],
    ['canción', 'cancion'],
    ['pingüino', 'pinguino'],
  ])('turns %s into plain letters', (word, expected) => {
    expect(transliterateDiacritics([word])).toEqual([expected]);
  });

  it('leaves words without diacritics unchanged', () => {
    expect(transliterateDiacritics(['scrabble'])).toEqual(['scrabble']);
  });

  it('merges words that become identical and keeps the first position', () => {
    expect(transliterateDiacritics(['zero', 'été', 'ete', 'aa'])).toEqual(['zero', 'ete', 'aa']);
  });

  it('keeps ignored characters while replacing the others', () => {
    expect(transliterateDiacritics(['ñandú'], { ignore: ['ñ'] })).toEqual(['ñandu']);
  });

  it('keeps words apart when only an ignored character distinguishes them', () => {
    expect(transliterateDiacritics(['ano', 'año'], { ignore: ['ñ'] })).toEqual(['ano', 'año']);
  });

  it('leaves the input array untouched', () => {
    const words = ['été'];

    transliterateDiacritics(words);

    expect(words).toEqual(['été']);
  });
});
