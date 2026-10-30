import { describe, expect, it } from 'bun:test';

import { type BoardWord } from '../BoardWord';

import { isSameBoardWord } from './isSameBoardWord';

describe('isSameBoardWord', () => {
  const word: BoardWord = { direction: 'horizontal', word: 'cat', x: 1, y: 2 };

  it('identifies a word by where it starts and which way it runs', () => {
    expect(isSameBoardWord(word, { ...word })).toBe(true);
  });

  it('ignores the text, since a changed word at the same place is the same word', () => {
    expect(isSameBoardWord(word, { ...word, word: 'cats' })).toBe(true);
  });

  it.each<[string, Partial<BoardWord>]>([
    ['direction', { direction: 'vertical' }],
    ['column', { x: 2 }],
    ['row', { y: 1 }],
  ])('tells apart a word with a different %s', (_name, change) => {
    expect(isSameBoardWord(word, { ...word, ...change })).toBe(false);
  });

  it('tells apart the two words starting at a shared cell', () => {
    const vertical: BoardWord = { direction: 'vertical', word: 'cod', x: 1, y: 2 };

    expect(isSameBoardWord(word, vertical)).toBe(false);
  });
});
