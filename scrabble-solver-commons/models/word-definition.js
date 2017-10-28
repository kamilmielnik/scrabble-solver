class WordDefinition {
  constructor({ definitions, isAllowed }) {
    this.definitions = definitions;
    this.isAllowed = isAllowed;
  }

  toJson() {
    return {
      definitions: this.definitions,
      isAllowed: this.isAllowed
    };
  }
}

export const NullWordDefinition = Object.freeze({
  definitions: [],
  isAllowed: false
});

export default WordDefinition;
