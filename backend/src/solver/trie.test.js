import Trie from './trie';

describe('Trie', () => {
  const words = [ 'abcd', 'abce', 'ace' ];
  const prefixes = [ 'a', 'ab', 'abc', 'ac', ...words ];
  const otherWords = [ 'b', 'bc', 'ce', 'bcd', 'bce' ];
  const otherPrefixes = [ 'b', 'bc', 'ce', 'bcd', 'bce' ];
  const trie = new Trie(words);

  it('has all the words', () => {
    words.forEach((word) => expect(trie.has(word)).toBe(true));
  });

  it('has all the prefixes', () => {
    prefixes.forEach((prefix) => expect(trie.hasMore(prefix)).toBe(true));
  });

  it('does not have other words', () => {
    otherWords.forEach((word) => expect(trie.has(word)).toBe(false));
  });

  it('does not have other prefixes', () => {
    otherPrefixes.forEach((word) => expect(trie.hasMore(word)).toBe(false));
  });
});
