const END_WORD = '@';

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
      node[END_WORD] = true;
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
    return node[END_WORD];
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

  static fromJson(json) {
    const trie = new Trie();
    trie.root = json;
    return trie;
  }
}

export default Trie;
