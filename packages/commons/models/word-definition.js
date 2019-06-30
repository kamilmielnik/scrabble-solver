class WordDefinition {
  constructor({ definitions, isAllowed, word }) {
    this.definitions = definitions;
    this.isAllowed = isAllowed;
    this.word = word;
  }

  toJson() {
    return {
      definitions: this.definitions,
      isAllowed: this.isAllowed,
      word: this.word
    };
  }
}

export const NullWordDefinition = Object.freeze({
  definitions: [],
  isAllowed: false,
  word: ''
});

export default WordDefinition;
