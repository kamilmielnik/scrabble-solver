/* eslint-disable no-bitwise */
import { LAST_ARC_FLAG, LETTER_MASK, MAGIC, SEPARATOR } from './constants';

/**
 * A GADDAG (Gordon, 1994) stored as flat typed arrays for speed and compact serialization.
 *
 * For every word `w` and every split `1 <= s <= |w|` the automaton accepts
 * `reverse(w[0..s)) + ◇ + w[s..)` (the separator is omitted when `s === |w|`).
 *
 * States are identified by "refs": `ref = (firstArcIndex << 1) | isWordEnd`.
 * A `firstArcIndex` of 0 means the state has no outgoing arcs; ref 0 means "no such state".
 * Arcs of a state are contiguous; the last one is marked with {@link LAST_ARC_FLAG} in its label.
 * An arc label stores the letter index (1..63, 0 = separator) in its low 6 bits.
 */
export class Gaddag {
  /** Arc labels: letter index | LAST_ARC_FLAG. Index 0 is an unused sentinel. */
  public readonly arcLabels: Uint8Array;

  /** Arc targets: encoded state refs. Index 0 is an unused sentinel. */
  public readonly arcTargets: Int32Array;

  /** Ref of the root state. */
  public readonly rootRef: number;

  /** Code point of each letter index (position 0 holds the code point of letter 1). */
  public readonly charCodes: Int32Array;

  private readonly letterByCharCode: Map<number, number>;

  constructor(arcLabels: Uint8Array, arcTargets: Int32Array, rootRef: number, charCodes: Int32Array) {
    this.arcLabels = arcLabels;
    this.arcTargets = arcTargets;
    this.rootRef = rootRef;
    this.charCodes = charCodes;
    this.letterByCharCode = new Map();

    for (let index = 0; index < charCodes.length; ++index) {
      this.letterByCharCode.set(charCodes[index], index + 1);
    }
  }

  public static deserialize(bytes: Uint8Array): Gaddag {
    // Note: an explicit copy (not .slice()) — Buffer.prototype.slice returns a
    // view that would keep the misaligned byteOffset.
    const aligned = bytes.byteOffset % 4 === 0 ? bytes : new Uint8Array(bytes);
    const header = new Int32Array(aligned.buffer, aligned.byteOffset, 4);

    if (header[0] !== MAGIC) {
      throw new Error('Invalid Gaddag data');
    }

    const letterCount = header[1];
    const arcCount = header[2];
    const rootRef = header[3];
    const charCodes = new Int32Array(aligned.buffer, aligned.byteOffset + 16, letterCount);
    const arcTargets = new Int32Array(aligned.buffer, aligned.byteOffset + 16 + 4 * letterCount, arcCount);
    const arcLabels = new Uint8Array(aligned.buffer, aligned.byteOffset + 16 + 4 * (letterCount + arcCount), arcCount);
    return new Gaddag(arcLabels, arcTargets, rootRef, charCodes);
  }

  public serialize(): Uint8Array {
    const letterCount = this.charCodes.length;
    const arcCount = this.arcTargets.length;
    const bytes = new Uint8Array(16 + 4 * (letterCount + arcCount) + arcCount);
    const header = new Int32Array(bytes.buffer, 0, 4);
    header[0] = MAGIC;
    header[1] = letterCount;
    header[2] = arcCount;
    header[3] = this.rootRef;
    new Int32Array(bytes.buffer, 16, letterCount).set(this.charCodes);
    new Int32Array(bytes.buffer, 16 + 4 * letterCount, arcCount).set(this.arcTargets);
    bytes.set(this.arcLabels, 16 + 4 * (letterCount + arcCount));
    return bytes;
  }

  /** Number of arcs (including the unused sentinel at index 0). */
  public get arcsCount(): number {
    return this.arcTargets.length;
  }

  /**
   * Follows the arc labeled with `letter` from the state `ref` points at.
   * Returns the target ref, or 0 when there is no such arc.
   *
   * A state's arcs are stored in ascending letter order, so the scan stops as
   * soon as it passes the wanted letter.
   */
  public getArc(ref: number, letter: number): number {
    let index = ref >>> 1;

    if (index === 0) {
      return 0;
    }

    const labels = this.arcLabels;

    for (;;) {
      const label = labels[index];
      const arcLetter = label & LETTER_MASK;

      if (arcLetter === letter) {
        return this.arcTargets[index];
      }

      if (arcLetter > letter || label >= LAST_ARC_FLAG) {
        return 0;
      }

      ++index;
    }
  }

  /** Maps a code point to its letter index, or -1 when the character is not in the alphabet. */
  public getLetter(charCode: number): number {
    return this.letterByCharCode.get(charCode) ?? -1;
  }

  public has(word: string): boolean {
    const length = word.length;

    if (length === 0) {
      return false;
    }

    let ref = this.rootRef;

    for (let index = length - 1; index >= 0; --index) {
      const letter = this.getLetter(word.charCodeAt(index));

      if (letter === -1) {
        return false;
      }

      ref = this.getArc(ref, letter);

      if (ref === 0) {
        return false;
      }
    }

    return (ref & 1) === 1;
  }

  public hasPrefix(prefix: string): boolean {
    const length = prefix.length;

    if (length === 0) {
      return true;
    }

    let ref = this.rootRef;

    for (let index = length - 1; index >= 0; --index) {
      const letter = this.getLetter(prefix.charCodeAt(index));

      if (letter === -1) {
        return false;
      }

      ref = this.getArc(ref, letter);

      if (ref === 0) {
        return false;
      }
    }

    return (ref & 1) === 1 || this.getArc(ref, SEPARATOR) !== 0;
  }
}
