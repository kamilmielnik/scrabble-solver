import Trie, { WORD_END } from './trie';

describe('Trie', () => {
  const words = [ 'ab', 'abcd', 'abce', 'ace' ];
  const prefixes = [ 'a', 'ab', 'abc', 'ac', ...words ];
  const otherWords = [ 'b', 'bc', 'ce', 'bcd', 'bce' ];
  const otherPrefixes = [ 'b', 'bc', 'ce', 'bcd', 'bce' ];
  const trie = new Trie(words);
  const compressedTrie = '(a(b,b(c(d,e)),c(e)))';
  const trieJson = {
    a: {
      b: {
        [WORD_END]: true,
        c: {
          d: {
            [WORD_END]: true
          },
          e: {
            [WORD_END]: true
          }
        }
      },
      c: {
        e: {
          [WORD_END]: true
        }
      }
    }
  };

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

  it('properly converts to json', () => {
    expect(trie.toJson()).toEqual(trieJson);
  });

  it('properly compresses', () => {
    expect(trie.compress()).toEqual(compressedTrie);
  });

  it('properly decompresses', () => {
    expect(Trie.decompress(compressedTrie).toJson()).toEqual(trieJson);
  });
});
