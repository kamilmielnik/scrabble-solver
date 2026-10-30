import { describe, expect, it } from 'bun:test';

import { WordDefinition } from './WordDefinition';
import { type WordDefinitionJson } from './WordDefinitionJson';

describe('WordDefinition', () => {
  describe('fromJson and toJson', () => {
    it.each([
      ['a defined word', { definitions: ['first', 'second'], exists: true, isAllowed: true, word: 'cat' }],
      ['a word allowed without a definition', { definitions: [], exists: false, isAllowed: true, word: 'qi' }],
      ['a word in the dictionary but not allowed', { definitions: ['x'], exists: true, isAllowed: false, word: 'xy' }],
      ['an unknown word', { definitions: [], exists: false, isAllowed: false, word: 'zzz' }],
      ['an empty word', { definitions: [], exists: false, isAllowed: false, word: '' }],
    ])('round-trips %s exactly', (_name, json) => {
      expect(WordDefinition.fromJson(json).toJson()).toStrictEqual(json);
    });

    it('survives serialization to text', () => {
      const json: WordDefinitionJson = { definitions: ['ą'], exists: true, isAllowed: false, word: 'wąż' };
      const decoded = JSON.parse(JSON.stringify(json)) as WordDefinitionJson;

      expect(WordDefinition.fromJson(decoded).toJson()).toStrictEqual(json);
    });

    it('reads a missing definition as the shared null definition', () => {
      expect(WordDefinition.fromJson(null)).toBe(WordDefinition.Null);
    });

    it('builds a real instance that exposes every field', () => {
      const definition = WordDefinition.fromJson({ definitions: ['d'], exists: true, isAllowed: false, word: 'w' });

      expect(definition).toBeInstanceOf(WordDefinition);
      expect(definition.definitions).toEqual(['d']);
      expect(definition.exists).toBe(true);
      expect(definition.isAllowed).toBe(false);
      expect(definition.word).toBe('w');
    });

    it('keeps the order of definitions', () => {
      const definitions = ['z', 'a', 'm'];

      expect(new WordDefinition({ definitions, exists: true, isAllowed: true, word: 'w' }).definitions).toEqual([
        'z',
        'a',
        'm',
      ]);
    });
  });
});

describe('WordDefinition.Null', () => {
  it('describes a word that nobody knows', () => {
    expect(WordDefinition.Null.definitions).toEqual([]);
    expect(WordDefinition.Null.exists).toBe(false);
    expect(WordDefinition.Null.isAllowed).toBe(false);
    expect(WordDefinition.Null.word).toBe('');
  });

  it('serializes to null, which reads back as itself', () => {
    expect(WordDefinition.Null.toJson()).toBeNull();
    expect(WordDefinition.fromJson(WordDefinition.Null.toJson())).toBe(WordDefinition.Null);
  });

  it('cannot be mutated', () => {
    expect(Object.isFrozen(WordDefinition.Null)).toBe(true);
  });
});
