const END_WORD = '@';

class Trie {
  constructor(words = []) {
    this.trie = words.reduce((trie, word) => {
      let node = trie;
      for (const character of word) {
        if(!node[character]) {
          node[character] = {};
        }
        node = node[character];
      }
      node[END_WORD] = true;
      return trie;
    }, {});
  }

  has(word) {
    let node = this.trie;
    for (const character of word) {
      if(!node[character]) {
        return false;
      }
      node = node[character];
    }
    return node[END_WORD];
  }

  hasMore(word) {
    let node = this.trie;
    for (const character of word) {
      if(!node[character]) {
        return false;
      }
      node = node[character];
    }
    return Object.keys(node).length > 0;
  }

  toJson() {
    return this.trie;
  }

  static fromJson(json) {
    const trie = new Trie();
    trie.trie = json;
    return trie;
  }
}

export default Trie;
