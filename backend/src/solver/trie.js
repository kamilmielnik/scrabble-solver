export const SEPARATOR = ',';
export const OPEN_PARENS = '(';
export const CLOSE_PARENS = ')';

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
      node.wordEnd = true;
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
    return node.wordEnd;
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
    const letters = Object.keys(node).filter((key) => key.length === 1);
    const hasMore = letters.length > 0;
    let compressed = '';
    if(node.wordEnd) {
      compressed += character;
    }
    if(node.wordEnd && hasMore) {
      compressed += SEPARATOR;
    }
    if(hasMore) {
      compressed += character;
      compressed += OPEN_PARENS;
      compressed += letters.map((letter) => this.compress(node[letter], letter)).join(SEPARATOR);
      compressed += CLOSE_PARENS;
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

      if(character === CLOSE_PARENS) {
        node = stack.pop();
      } else if(nextCharacter === SEPARATOR) {
        node[character] = { wordEnd: true };
        ++i;
      } else if(nextCharacter === CLOSE_PARENS) {
        node[character] = { wordEnd: true };
        node = stack.pop();
        ++i;
      } else if(nextCharacter === OPEN_PARENS) {
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
