import WordDefinitionJson from './WordDefinitionJson';

class WordDefinition {
  public static fromJson(json: WordDefinitionJson | null): WordDefinition {
    if (!json) {
      return WordDefinition.Null;
    }

    return new WordDefinition({
      definitions: json.definitions,
      exists: json.exists,
      isAllowed: json.isAllowed,
      word: json.word,
    });
  }

  public static readonly Null: WordDefinition = Object.freeze({
    definitions: [],
    exists: false,
    isAllowed: false,
    word: '',
    toJson: () => null,
  });

  public readonly definitions: string[];

  /**
   * Does the word have an entry in a corresponding online dictionary?
   */
  public readonly exists: boolean;

  /**
   * Can the word be legally used in the game?
   */
  public readonly isAllowed: boolean;

  public readonly word: string;

  constructor({ definitions, exists, isAllowed, word }: WordDefinitionJson) {
    this.definitions = definitions;
    this.exists = exists;
    this.isAllowed = isAllowed;
    this.word = word;
  }

  public toJson(): WordDefinitionJson | null {
    return {
      definitions: this.definitions,
      exists: this.exists,
      isAllowed: this.isAllowed,
      word: this.word,
    };
  }
}

export default WordDefinition;
