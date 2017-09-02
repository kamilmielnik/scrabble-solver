const SEPARATOR = ',';
const OPEN_PARENS = '(';
const CLOSE_PARENS = ')';

const wordEndNode = { wordEnd: true };

export const compress = (node, character = '') => {
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
    compressed += letters.map((letter) => compress(node[letter], letter)).join(SEPARATOR);
    compressed += CLOSE_PARENS;
  }
  return compressed;
};

export const decompress = (compressed) => {
  const stack = [];
  let node = {};
  let i = 1;

  while (i < compressed.length - 1) {
    const character = compressed[i];
    const nextCharacter = compressed[++i];

    if(character === CLOSE_PARENS) {
      node = stack.pop();
    } else if(nextCharacter === SEPARATOR) {
      node[character] = { ...wordEndNode };
      ++i;
    } else if(nextCharacter === CLOSE_PARENS) {
      node[character] = { ...wordEndNode };
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

  return node;
};
