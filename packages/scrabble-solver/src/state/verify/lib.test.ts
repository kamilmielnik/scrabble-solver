import { type BoardWord } from '@scrabble-solver/types';

import { SortDirection, WordColumnId } from '../../types';

import { getWordCoordinates, sortWords } from './lib';

describe('getWordCoordinates', () => {
  it('locates a horizontal word by its start cell', () => {
    expect(getWordCoordinates(createWord({ x: 3, y: 3 }), 'original')).toBe('4D');
  });

  it('locates a vertical word by its start cell', () => {
    expect(getWordCoordinates(createWord({ direction: 'vertical', x: 3, y: 3 }), 'original')).toBe('D4');
  });
});

describe('sortWords', () => {
  const cat = createWord({ word: 'cat', x: 3, y: 3 });
  const zvq = createWord({ isValid: false, word: 'zvq', x: 3, y: 5 });

  it('sorts by word', () => {
    const sort = { column: WordColumnId.Word, direction: SortDirection.Ascending };

    expect(sortWords([zvq, cat], sort, 'en-US', 'original')).toEqual([cat, zvq]);
  });

  it('sorts by coordinates', () => {
    const sort = { column: WordColumnId.Coordinates, direction: SortDirection.Ascending };

    expect(sortWords([zvq, cat], sort, 'en-US', 'original')).toEqual([cat, zvq]);
  });

  it('sorts invalid words first by validity', () => {
    const sort = { column: WordColumnId.Validity, direction: SortDirection.Ascending };

    expect(sortWords([cat, zvq], sort, 'en-US', 'original')).toEqual([zvq, cat]);
  });

  it('reverses the order when sorting descending', () => {
    const sort = { column: WordColumnId.Word, direction: SortDirection.Descending };

    expect(sortWords([cat, zvq], sort, 'en-US', 'original')).toEqual([zvq, cat]);
  });

  it('does not modify the input', () => {
    const sort = { column: WordColumnId.Word, direction: SortDirection.Ascending };
    const words = [zvq, cat];

    sortWords(words, sort, 'en-US', 'original');

    expect(words).toEqual([zvq, cat]);
  });
});

function createWord(overrides: Partial<BoardWord>): BoardWord {
  return { direction: 'horizontal', isValid: true, word: 'cat', x: 0, y: 0, ...overrides };
}
