import WordDefinitionJson from './WordDefinitionJson';

class WordDefinition {
  public static fromJson(json: WordDefinitionJson | null): WordDefinition {
    if (!json) {
      return WordDefinition.Null;
    }

    return new WordDefinition({
      definitions: json.definitions,
      isAllowed: json.isAllowed,
      word: json.word,
    });
  }

  public static readonly Null: WordDefinition = Object.freeze({
    definitions: [],
    isAllowed: false,
    word: '',
    toJson: () => null,
  });

  public readonly definitions: string[];

  public readonly isAllowed: boolean;

  public readonly word: string;

  constructor({ definitions, isAllowed, word }: { definitions: string[]; isAllowed: boolean; word: string }) {
    this.definitions = definitions;
    this.isAllowed = isAllowed;
    this.word = word;
  }

  public toJson(): WordDefinitionJson | null {
    return {
      definitions: this.definitions,
      isAllowed: this.isAllowed,
      word: this.word,
    };
  }
}

export default WordDefinition;
