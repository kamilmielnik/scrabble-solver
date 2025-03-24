export interface WordDefinitionJson {
  definitions: string[];
  /**
   * Does the word have an entry in a corresponding online dictionary?
   */
  exists: boolean;
  /**
   * Can the word be legally used in the game?
   */
  isAllowed: boolean;
  word: string;
}
