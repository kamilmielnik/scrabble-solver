export const WORD_END = '@';
export const COMPRESS_SEPARATOR = ',';

class Trie {
  constructor(words = []) {
    this.root = words.reduce((trie, word) => {
      let node = trie;
      for (const character of word) {
        if(!node[character]) {
          node[character] = {};
        }
        node = node[character];
      }
      node[WORD_END] = true;
      return trie;
    }, {});
  }

  has(word) {
    let node = this.root;
    for (const character of word) {
      if(!node[character]) {
        return false;
      }
      node = node[character];
    }
    return node[WORD_END];
  }

  hasMore(word) {
    let node = this.root;
    for (const character of word) {
      if(!node[character]) {
        return false;
      }
      node = node[character];
    }
    return Object.keys(node).length > 0;
  }

  toJson() {
    return this.root;
  }

  compress(node = this.root, character = '') {
    const characters = Object.keys(node);
    const letters = characters.filter((character) => character !== WORD_END);
    const isWord = Boolean(node[WORD_END]);
    const hasMore = letters.length > 0;
    let compressed = '';
    if(isWord) {
      compressed += character;
    }
    if(isWord && hasMore) {
      compressed += COMPRESS_SEPARATOR;
    }
    if(hasMore) {
      compressed += character;
      compressed += '(';
      compressed += letters.map((letter) => this.compress(node[letter], letter)).join(COMPRESS_SEPARATOR);
      compressed += ')';
    }
    return compressed;
  }

  static decompress(compressed) {
    const trie = new Trie();
    const stack = [];
    let node = trie.root;
    let i = 1;

    while (i < compressed.length - 1) {
      const character = compressed[i];
      const nextCharacter = compressed[++i];

      if(character === ')') {
        node = stack.pop();
      } else if(nextCharacter === COMPRESS_SEPARATOR) {
        node[character] = { [WORD_END]: true };
        ++i;
      } else if(nextCharacter === ')') {
        node[character] = { [WORD_END]: true };
        node = stack.pop();
        ++i;
      } else if(nextCharacter === '(') {
        stack.push(node);
        const newNode = node[character] || {};
        node[character] = newNode;
        node = newNode;
        ++i;
      }
    }

    return trie;
  }

  static fromJson(json) {
    const trie = new Trie();
    trie.root = json;
    return trie;
  }
}

export default Trie;
