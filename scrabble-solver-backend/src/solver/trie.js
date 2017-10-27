import { serialize, deserialize } from './trie-serializer';

class Trie {
  constructor(words = []) {
    this.root = words.reduce((trie, word) => {
      let node = trie;
      for (const character of word) {
        if (!node[character]) {
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
      if (!node[character]) {
        return false;
      }
      node = node[character];
    }
    return node.wordEnd;
  }

  hasMore(word) {
    let node = this.root;
    for (const character of word) {
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

  static deserialize(serialized) {
    const trie = new Trie();
    trie.root = deserialize(serialized);
    return trie;
  }

  static fromJson(json) {
    const trie = new Trie();
    trie.root = json;
    return trie;
  }
}

export default Trie;
