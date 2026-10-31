import { type Config } from '../Config';

/**
 * A digraph must be played as its single tile, so neighboring tiles must not spell one.
 */
export function spellsDigraph(characters: readonly string[], config: Config): boolean {
  for (let start = 0; start < characters.length - 1; ++start) {
    let spelled = characters[start];

    for (let end = start + 1; end < characters.length && spelled.length < config.longestDigraphLength; ++end) {
      spelled += characters[end];

      if (config.digraphs.includes(spelled)) {
        return true;
      }
    }
  }

  return false;
}
