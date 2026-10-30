import { describe, expect, it } from 'bun:test';

import { Game } from './Game';

describe('Game', () => {
  it('keeps the values stored in settings and sent to the API', () => {
    const entries: [string, string][] = Object.entries(Game);

    expect(entries).toEqual([
      ['Crossplay', 'crossplay'],
      ['Kelimelik', 'kelimelik'],
      ['LetterLeague', 'letter-league'],
      ['Literaki', 'literaki'],
      ['Scrabble', 'scrabble'],
      ['ScrabbleDuel', 'scrabble-duel'],
      ['SuperScrabble', 'super-scrabble'],
      ['Wordfeud', 'wordfeud'],
      ['Wyrazy', 'wyrazy'],
    ]);
  });
});
