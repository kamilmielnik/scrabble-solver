import { compress, decompress } from './trie-compressor';

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

  compress() {
    return compress(this.root);
  }

  toJson() {
    return this.root;
  }

  static decompress(compressed) {
    const trie = new Trie();
    trie.root = decompress(compressed);
    return trie;
  }

  static fromJson(json) {
    const trie = new Trie();
    trie.root = json;
    return trie;
  }
}

export default Trie;
