const SEPARATOR = ',';
const OPEN_PARENS = '(';
const CLOSE_PARENS = ')';

const wordEndNode = { wordEnd: true };

export const serialize = (node, character = '') => {
  const letters = Object.keys(node).filter((key) => key.length === 1);
  const hasMore = letters.length > 0;
  let serialized = '';
  if (node.wordEnd) {
    serialized += character;
  }
  if (node.wordEnd && hasMore) {
    serialized += SEPARATOR;
  }
  if (hasMore) {
    serialized += character;
    serialized += OPEN_PARENS;
    serialized += letters.map((letter) => serialize(node[letter], letter)).join(SEPARATOR);
    serialized += CLOSE_PARENS;
  }
  return serialized;
};

export const deserialize = (serialized) => {
  const stack = [];
  let node = {};
  let i = 1;

  while (i < serialized.length - 1) {
    const character = serialized[i];
    const nextCharacter = serialized[++i];

    if (character === CLOSE_PARENS) {
      node = stack.pop();
    } else if (nextCharacter === SEPARATOR) {
      node[character] = { ...wordEndNode };
      ++i;
    } else if (nextCharacter === CLOSE_PARENS) {
      node[character] = { ...wordEndNode };
      node = stack.pop();
      ++i;
    } else if (nextCharacter === OPEN_PARENS) {
      stack.push(node);
      const newNode = node[character] || {};
      node[character] = newNode;
      node = newNode;
      ++i;
    }
  }

  return node;
};
