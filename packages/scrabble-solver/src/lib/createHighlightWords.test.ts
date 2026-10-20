import { createHighlightWords } from './createHighlightWords';

describe('createHighlightWords', () => {
  it('highlights nothing for an empty or blank query', () => {
    expect(createHighlightWords('')).toEqual([]);
    expect(createHighlightWords('   ')).toEqual([]);
  });

  it('highlights a query as a case-insensitive regular expression', () => {
    const [regExp] = createHighlightWords('^d|t$');
    expect('Dog cat'.match(regExp)).toEqual(['D', 't']);
  });
});
