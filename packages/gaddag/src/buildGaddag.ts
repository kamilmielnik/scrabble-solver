/* eslint-disable max-depth, max-lines, max-statements, no-bitwise */
import { LAST_ARC_FLAG, LETTER_MASK, MAX_LETTERS, MAX_WORD_LENGTH } from './constants';
import { Gaddag } from './Gaddag';

/**
 * Builds a minimal GADDAG from a word list.
 *
 * The construction generates every GADDAG sequence (`reverse(prefix) [+ ◇ + suffix]`)
 * as a compact `(wordIndex << 6) | splitIndex` integer, orders them with an in-place
 * MSD radix sort, and feeds them to an incremental minimal-automaton builder
 * (Daciuk et al., 2000) backed by typed arrays and an open-addressing state registry.
 */
export const buildGaddag = (words: string[]): Gaddag => {
  const { charCodes, letterByCharCode } = buildAlphabet(words);
  const { itemsCount, wordBytes, wordOffsets, wordsCount } = encodeWords(words, letterByCharCode);
  const items = generateItems(wordsCount, wordOffsets, itemsCount);
  sortItems(items, wordBytes, wordOffsets);
  return insertItems(items, wordBytes, wordOffsets, charCodes);
};

interface Alphabet {
  charCodes: Int32Array;
  letterByCharCode: Map<number, number>;
}

const buildAlphabet = (words: string[]): Alphabet => {
  const codes = new Set<number>();

  for (const word of words) {
    if (word.length > MAX_WORD_LENGTH) {
      continue;
    }

    for (let index = 0; index < word.length; ++index) {
      codes.add(word.charCodeAt(index));
    }
  }

  if (codes.size > MAX_LETTERS) {
    throw new Error(`Gaddag supports up to ${MAX_LETTERS} distinct characters, got ${codes.size}`);
  }

  const charCodes = Int32Array.from([...codes].sort((a, b) => a - b));
  const letterByCharCode = new Map<number, number>();

  for (let index = 0; index < charCodes.length; ++index) {
    letterByCharCode.set(charCodes[index], index + 1);
  }

  return { charCodes, letterByCharCode };
};

interface EncodedWords {
  itemsCount: number;
  wordBytes: Uint8Array;
  wordOffsets: Int32Array;
  wordsCount: number;
}

const encodeWords = (words: string[], letterByCharCode: Map<number, number>): EncodedWords => {
  let totalLength = 0;
  let wordsCount = 0;

  for (const word of words) {
    if (word.length === 0 || word.length > MAX_WORD_LENGTH) {
      continue;
    }

    totalLength += word.length;
    ++wordsCount;
  }

  if (wordsCount >= 1 << 25) {
    throw new Error('Gaddag supports up to 33M words');
  }

  const wordBytes = new Uint8Array(totalLength);
  const wordOffsets = new Int32Array(wordsCount + 1);
  let offset = 0;
  let wordIndex = 0;

  for (const word of words) {
    if (word.length === 0 || word.length > MAX_WORD_LENGTH) {
      continue;
    }

    wordOffsets[wordIndex] = offset;

    for (let index = 0; index < word.length; ++index) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      wordBytes[offset] = letterByCharCode.get(word.charCodeAt(index))!;
      ++offset;
    }

    ++wordIndex;
  }

  wordOffsets[wordsCount] = offset;
  return { itemsCount: totalLength, wordBytes, wordOffsets, wordsCount };
};

const generateItems = (wordsCount: number, wordOffsets: Int32Array, itemsCount: number): Int32Array => {
  const items = new Int32Array(itemsCount);
  let itemIndex = 0;

  for (let wordIndex = 0; wordIndex < wordsCount; ++wordIndex) {
    const length = wordOffsets[wordIndex + 1] - wordOffsets[wordIndex];

    for (let split = 1; split <= length; ++split) {
      items[itemIndex] = (wordIndex << 6) | split;
      ++itemIndex;
    }
  }

  return items;
};

/**
 * Radix character of sequence `item` at position `depth`:
 * 0 = end of sequence, 1 = separator, letter + 1 otherwise.
 */
const charAt = (item: number, depth: number, wordBytes: Uint8Array, wordOffsets: Int32Array): number => {
  const wordIndex = item >>> 6;
  const split = item & 63;
  const offset = wordOffsets[wordIndex];

  if (depth < split) {
    return wordBytes[offset + split - 1 - depth] + 1;
  }

  if (depth === split) {
    return split < wordOffsets[wordIndex + 1] - offset ? 1 : 0;
  }

  return depth <= wordOffsets[wordIndex + 1] - offset ? wordBytes[offset + depth - 1] + 1 : 0;
};

const RADIX = MAX_LETTERS + 2;

const sortItems = (items: Int32Array, wordBytes: Uint8Array, wordOffsets: Int32Array): void => {
  const auxiliary = new Int32Array(items.length);
  const counts = new Int32Array(RADIX);
  const starts = new Int32Array(RADIX);
  // Manual stack of (low, high, depth) ranges to avoid recursion.
  let stack = new Int32Array(3 * 64);
  let stackTop = 0;

  const push = (low: number, high: number, depth: number): void => {
    if (stackTop + 3 > stack.length) {
      const grown = new Int32Array(stack.length * 2);
      grown.set(stack);
      stack = grown;
    }

    stack[stackTop] = low;
    stack[stackTop + 1] = high;
    stack[stackTop + 2] = depth;
    stackTop += 3;
  };

  push(0, items.length, 0);

  while (stackTop > 0) {
    stackTop -= 3;
    const low = stack[stackTop];
    const high = stack[stackTop + 1];
    let depth = stack[stackTop + 2];

    if (high - low < 2) {
      continue;
    }

    for (;;) {
      counts.fill(0);

      for (let index = low; index < high; ++index) {
        ++counts[charAt(items[index], depth, wordBytes, wordOffsets)];
      }

      // Skip scatter when the whole range shares the character at this depth.
      let singleBucket = -1;

      for (let bucket = 0; bucket < RADIX; ++bucket) {
        if (counts[bucket] === high - low) {
          singleBucket = bucket;
          break;
        }

        if (counts[bucket] > 0) {
          break;
        }
      }

      if (singleBucket > 0) {
        ++depth;
        continue;
      }

      if (singleBucket === 0) {
        break;
      }

      let position = low;

      for (let bucket = 0; bucket < RADIX; ++bucket) {
        starts[bucket] = position;
        position += counts[bucket];
      }

      for (let index = low; index < high; ++index) {
        const item = items[index];
        auxiliary[starts[charAt(item, depth, wordBytes, wordOffsets)]++] = item;
      }

      items.set(auxiliary.subarray(low, high), low);

      // After the scatter, starts[bucket] holds the end position of each bucket.
      for (let bucket = 1; bucket < RADIX; ++bucket) {
        if (counts[bucket] > 1) {
          push(starts[bucket] - counts[bucket], starts[bucket], depth + 1);
        }
      }

      break;
    }
  }
};

const MAX_DEPTH = MAX_WORD_LENGTH + 2;
const MAX_ARCS_PER_STATE = MAX_LETTERS + 1;

class Builder {
  // Frozen arcs (1-indexed; index 0 is a sentinel).
  private labels = new Uint8Array(1 << 20);
  private targets = new Int32Array(1 << 20);
  private arcTop = 1;

  // Open-addressing registry of frozen states, storing first-arc indices (0 = empty slot).
  private table = new Int32Array(1 << 20);
  private tableCount = 0;

  // Temporary (not yet minimized) states along the current insertion path.
  private readonly pathLetters = new Uint8Array(MAX_DEPTH * MAX_ARCS_PER_STATE);
  private readonly pathTargets = new Int32Array(MAX_DEPTH * MAX_ARCS_PER_STATE);
  private readonly pathCounts = new Int32Array(MAX_DEPTH);
  private readonly pathFinal = new Uint8Array(MAX_DEPTH);

  private readonly previous = new Uint8Array(MAX_DEPTH);
  private previousLength = 0;

  public insert(sequence: Uint8Array, length: number): void {
    const { previous, pathCounts, pathFinal } = this;
    let commonPrefixLength = 0;
    const maxCommon = Math.min(length, this.previousLength);

    while (commonPrefixLength < maxCommon && sequence[commonPrefixLength] === previous[commonPrefixLength]) {
      ++commonPrefixLength;
    }

    if (commonPrefixLength === length && commonPrefixLength === this.previousLength) {
      return; // Duplicate sequence.
    }

    for (let depth = this.previousLength; depth > commonPrefixLength; --depth) {
      this.freeze(depth);
    }

    for (let depth = commonPrefixLength; depth < length; ++depth) {
      const base = depth * MAX_ARCS_PER_STATE;
      this.pathLetters[base + pathCounts[depth]] = sequence[depth];
      this.pathTargets[base + pathCounts[depth]] = 0;
      ++pathCounts[depth];
      pathCounts[depth + 1] = 0;
      pathFinal[depth + 1] = 0;
    }

    pathFinal[length] = 1;
    previous.set(sequence.subarray(0, length));
    this.previousLength = length;
  }

  public finish(charCodes: Int32Array): Gaddag {
    for (let depth = this.previousLength; depth > 0; --depth) {
      this.freeze(depth);
    }

    const rootRef = this.registerState(0);
    const labels = this.labels.slice(0, this.arcTop);
    const targets = this.targets.slice(0, this.arcTop);
    return new Gaddag(labels, targets, rootRef, charCodes);
  }

  /** Minimizes the state at `depth` and patches its parent's dangling arc. */
  private freeze(depth: number): void {
    const ref = this.registerState(depth);
    const parentBase = (depth - 1) * MAX_ARCS_PER_STATE;
    this.pathTargets[parentBase + this.pathCounts[depth - 1] - 1] = ref;
  }

  /** Returns the ref of a frozen state equivalent to the temporary state at `depth`. */
  private registerState(depth: number): number {
    const count = this.pathCounts[depth];
    const final = this.pathFinal[depth];

    if (count === 0) {
      return final;
    }

    const base = depth * MAX_ARCS_PER_STATE;
    const hash = this.hashPath(base, count);
    const mask = this.table.length - 1;
    let slot = hash & mask;

    for (;;) {
      const existing = this.table[slot];

      if (existing === 0) {
        break;
      }

      if (this.equalsPath(existing, base, count)) {
        return (existing << 1) | final;
      }

      slot = (slot + 1) & mask;
    }

    const firstArc = this.appendArcs(base, count);
    this.table[slot] = firstArc;
    ++this.tableCount;

    if (this.tableCount * 10 > this.table.length * 7) {
      this.growTable();
    }

    return (firstArc << 1) | final;
  }

  private hashPath(base: number, count: number): number {
    let hash = 0x811c9dc5 ^ count;

    for (let index = 0; index < count; ++index) {
      hash = Math.imul(hash ^ this.pathLetters[base + index], 16777619);
      hash = Math.imul(hash ^ this.pathTargets[base + index], 16777619);
    }

    return hash >>> 0;
  }

  private hashFrozen(firstArc: number): number {
    let count = 0;

    for (let index = firstArc; ; ++index) {
      ++count;

      if (this.labels[index] >= LAST_ARC_FLAG) {
        break;
      }
    }

    let hash = 0x811c9dc5 ^ count;

    for (let index = 0; index < count; ++index) {
      hash = Math.imul(hash ^ (this.labels[firstArc + index] & LETTER_MASK), 16777619);
      hash = Math.imul(hash ^ this.targets[firstArc + index], 16777619);
    }

    return hash >>> 0;
  }

  private equalsPath(firstArc: number, base: number, count: number): boolean {
    for (let index = 0; index < count; ++index) {
      const label = this.labels[firstArc + index];

      if ((label & LETTER_MASK) !== this.pathLetters[base + index]) {
        return false;
      }

      if (this.targets[firstArc + index] !== this.pathTargets[base + index]) {
        return false;
      }

      const isLast = label >= LAST_ARC_FLAG;

      if (isLast !== (index === count - 1)) {
        return false;
      }
    }

    return true;
  }

  private appendArcs(base: number, count: number): number {
    if (this.arcTop + count > this.labels.length) {
      const capacity = Math.max(this.labels.length * 2, this.arcTop + count);
      const labels = new Uint8Array(capacity);
      labels.set(this.labels);
      this.labels = labels;
      const targets = new Int32Array(capacity);
      targets.set(this.targets);
      this.targets = targets;
    }

    const firstArc = this.arcTop;

    for (let index = 0; index < count; ++index) {
      this.labels[this.arcTop] = this.pathLetters[base + index] | (index === count - 1 ? LAST_ARC_FLAG : 0);
      this.targets[this.arcTop] = this.pathTargets[base + index];
      ++this.arcTop;
    }

    return firstArc;
  }

  private growTable(): void {
    const previousTable = this.table;
    this.table = new Int32Array(previousTable.length * 2);
    const mask = this.table.length - 1;

    for (const firstArc of previousTable) {
      if (firstArc === 0) {
        continue;
      }

      let slot = this.hashFrozen(firstArc) & mask;

      while (this.table[slot] !== 0) {
        slot = (slot + 1) & mask;
      }

      this.table[slot] = firstArc;
    }
  }
}

const insertItems = (
  items: Int32Array,
  wordBytes: Uint8Array,
  wordOffsets: Int32Array,
  charCodes: Int32Array,
): Gaddag => {
  const builder = new Builder();
  const sequence = new Uint8Array(MAX_DEPTH);

  for (let index = 0; index < items.length; ++index) {
    const item = items[index];
    const wordIndex = item >>> 6;
    const split = item & 63;
    const offset = wordOffsets[wordIndex];
    const length = wordOffsets[wordIndex + 1] - offset;
    let sequenceLength = 0;

    for (let position = split - 1; position >= 0; --position) {
      sequence[sequenceLength] = wordBytes[offset + position];
      ++sequenceLength;
    }

    if (split < length) {
      sequence[sequenceLength] = 0;
      ++sequenceLength;

      for (let position = split; position < length; ++position) {
        sequence[sequenceLength] = wordBytes[offset + position];
        ++sequenceLength;
      }
    }

    builder.insert(sequence, sequenceLength);
  }

  return builder.finish(charCodes);
};
