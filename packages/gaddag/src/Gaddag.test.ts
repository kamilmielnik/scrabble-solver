/* eslint-disable no-bitwise */
import { buildGaddag } from './buildGaddag';
import { SEPARATOR } from './constants';
import { Gaddag } from './Gaddag';

const WORDS = [
  'a',
  'ab',
  'able',
  'ale',
  'axe',
  'bar',
  'bard',
  'barn',
  'car',
  'card',
  'care',
  'cozy',
  'flame',
  'flames',
];

describe('buildGaddag', () => {
  it('contains exactly the inserted words', () => {
    const gaddag = buildGaddag(WORDS);

    for (const word of WORDS) {
      expect(gaddag.has(word)).toBe(true);
    }

    for (const word of ['', 'b', 'ba', 'abl', 'ables', 'cardd', 'zzz', 'lame', 'ar', 'ame', 'ards']) {
      expect(gaddag.has(word)).toBe(false);
    }
  });

  it('answers hasPrefix', () => {
    const gaddag = buildGaddag(WORDS);

    for (const prefix of ['', 'a', 'ab', 'abl', 'able', 'b', 'ba', 'bar', 'card', 'f', 'flame']) {
      expect(gaddag.hasPrefix(prefix)).toBe(true);
    }

    for (const prefix of ['e', 'z', 'ax_', 'flames2', 'lame', 'bardo']) {
      expect(gaddag.hasPrefix(prefix)).toBe(false);
    }
  });

  it('handles duplicated and unsorted input', () => {
    const gaddag = buildGaddag(['zebra', 'ant', 'zebra', 'ant', 'bee']);

    expect(gaddag.has('zebra')).toBe(true);
    expect(gaddag.has('ant')).toBe(true);
    expect(gaddag.has('bee')).toBe(true);
    expect(gaddag.has('zebr')).toBe(false);
  });

  it('contains every rev(prefix)+separator+suffix decomposition', () => {
    const gaddag = buildGaddag(WORDS);

    for (const word of WORDS) {
      for (let split = 1; split <= word.length; ++split) {
        let ref = gaddag.rootRef;

        for (let index = split - 1; index >= 0; --index) {
          ref = gaddag.getArc(ref, gaddag.getLetter(word.charCodeAt(index)));
          expect(ref).not.toBe(0);
        }

        if (split < word.length) {
          ref = gaddag.getArc(ref, SEPARATOR);
          expect(ref).not.toBe(0);

          for (let index = split; index < word.length; ++index) {
            ref = gaddag.getArc(ref, gaddag.getLetter(word.charCodeAt(index)));
            expect(ref).not.toBe(0);
          }
        }

        expect(ref & 1).toBe(1);
      }
    }
  });

  it('does not accept sequences with misplaced separator', () => {
    const gaddag = buildGaddag(['ab']);
    // 'ba' is in the gaddag as rev('ab'), but 'ab' itself (without separator) is not a path ending in a word
    // unless it corresponds to a decomposition.
    const a = gaddag.getLetter('a'.charCodeAt(0));
    const b = gaddag.getLetter('b'.charCodeAt(0));

    // rev(ab) = 'ba' → word end.
    const refB = gaddag.getArc(gaddag.rootRef, b);
    expect(refB).not.toBe(0);
    const refBA = gaddag.getArc(refB, a);
    expect(refBA & 1).toBe(1);

    // 'a' + separator + 'b' → word end.
    const refA = gaddag.getArc(gaddag.rootRef, a);
    expect(refA).not.toBe(0);
    const refASep = gaddag.getArc(refA, SEPARATOR);
    expect(refASep).not.toBe(0);
    expect(gaddag.getArc(refASep, b) & 1).toBe(1);

    // No separator arc after the full reversed word.
    expect(gaddag.getArc(refBA, SEPARATOR)).toBe(0);
  });

  it('supports multi-byte characters', () => {
    const words = ['żyło', 'żyła', 'być', 'łoże'];
    const gaddag = buildGaddag(words);

    for (const word of words) {
      expect(gaddag.has(word)).toBe(true);
    }

    expect(gaddag.has('żył')).toBe(false);
    expect(gaddag.hasPrefix('żył')).toBe(true);
  });

  it('round-trips through serialize/deserialize', () => {
    const gaddag = buildGaddag(WORDS);
    const bytes = gaddag.serialize();
    const deserialized = Gaddag.deserialize(bytes);

    expect(deserialized.rootRef).toBe(gaddag.rootRef);
    expect([...deserialized.arcLabels]).toEqual([...gaddag.arcLabels]);
    expect([...deserialized.arcTargets]).toEqual([...gaddag.arcTargets]);

    for (const word of WORDS) {
      expect(deserialized.has(word)).toBe(true);
    }

    expect(deserialized.has('zzz')).toBe(false);
  });

  it('deserializes from unaligned byte offsets', () => {
    const gaddag = buildGaddag(WORDS);
    const bytes = gaddag.serialize();
    const shifted = new Uint8Array(bytes.length + 1);
    shifted.set(bytes, 1);
    const unaligned = new Uint8Array(shifted.buffer, 1, bytes.length);
    const deserialized = Gaddag.deserialize(unaligned);

    for (const word of WORDS) {
      expect(deserialized.has(word)).toBe(true);
    }
  });

  it('rejects invalid data', () => {
    expect(() => Gaddag.deserialize(new Uint8Array(16))).toThrow('Invalid Gaddag data');
  });

  it('handles an empty word list', () => {
    const gaddag = buildGaddag([]);
    expect(gaddag.has('a')).toBe(false);
    expect(gaddag.hasPrefix('')).toBe(true);
  });

  it('is minimal enough to share suffixes', () => {
    // 'talking'/'walking' share most of their structure; a raw trie of all
    // gaddag sequences would need far more arcs than 100.
    const gaddag = buildGaddag(['talking', 'walking', 'talked', 'walked']);
    expect(gaddag.arcsCount).toBeLessThan(70);
  });

  it('matches a brute-force dictionary on random words', () => {
    const seededRandom = (() => {
      let seed = 42;
      return () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return seed / 0x7fffffff;
      };
    })();

    const letters = 'abcdefg';
    const randomWord = () => {
      const length = 1 + Math.floor(seededRandom() * 8);
      let word = '';

      for (let index = 0; index < length; ++index) {
        word += letters[Math.floor(seededRandom() * letters.length)];
      }

      return word;
    };

    const words = new Set<string>();

    for (let index = 0; index < 500; ++index) {
      words.add(randomWord());
    }

    const gaddag = buildGaddag([...words]);

    for (const word of words) {
      expect(gaddag.has(word)).toBe(true);
    }

    for (let index = 0; index < 2000; ++index) {
      const word = randomWord();
      expect(gaddag.has(word)).toBe(words.has(word));
    }
  });
});
