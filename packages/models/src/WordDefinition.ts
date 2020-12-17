import WordDefinitionJson from './WordDefinitionJson';

class WordDefinition {
  public static readonly Null: WordDefinition = Object.freeze(
    new WordDefinition({
      definitions: [],
      isAllowed: false,
      word: ''
    })
  );

  public readonly definitions: string[];

  public readonly isAllowed: boolean;

  public readonly word: string;

  constructor({ definitions, isAllowed, word }: { definitions: string[]; isAllowed: boolean; word: string }) {
    this.definitions = definitions;
    this.isAllowed = isAllowed;
    this.word = word;
  }

  public toJson(): WordDefinitionJson {
    return {
      definitions: this.definitions,
      isAllowed: this.isAllowed,
      word: this.word
    };
  }
}

export default WordDefinition;
