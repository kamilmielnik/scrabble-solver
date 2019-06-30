import { serialize, deserialize } from './serializer';

class Trie {
  static deserialize(serialized) {
    const trie = new Trie();
    trie.root = deserialize(serialized);
    return trie;
  }

  static fromArray(array) {
    const root = array.reduce((trie, word) => {
      let node = trie;

      for (let index = 0; index < word.length; ++index) {
        const character = word[index];

        if (!node[character]) {
          node[character] = {};
        }

        node = node[character];
      }

      node.wordEnd = true;

      return trie;
    }, {});

    return new Trie(root);
  }

  constructor(root = {}) {
    this.root = root;
  }

  has(word) {
    let node = this.root;

    for (let index = 0; index < word.length; ++index) {
      const character = word[index];

      if (!node[character]) {
        return false;
      }

      node = node[character];
    }

    return node.wordEnd;
  }

  hasMore(word) {
    let node = this.root;

    for (let index = 0; index < word.length; ++index) {
      const character = word[index];
      if (!node[character]) {
        return false;
      }
      node = node[character];
    }

    return Object.keys(node).length > 0;
  }

  serialize() {
    return serialize(this.root);
  }

  toJson() {
    return this.root;
  }
}

export default Trie;
