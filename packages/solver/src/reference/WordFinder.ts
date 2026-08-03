/** The dictionary-lookup interface the reference solver needs. A {@link Gaddag} satisfies it. */
export interface WordFinder {
  has(word: string): boolean;
  hasPrefix(prefix: string): boolean;
}
