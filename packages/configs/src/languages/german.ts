import { Config, Locale } from '@scrabble-solver/types';

import { scrabble } from '../games';

export const germanScrabble = new Config({
  ...scrabble,
  locale: Locale.DE_DE,
  tiles: [
    { character: 'a', count: 5, score: 1 },
    { character: 'ä', count: 1, score: 6 },
    { character: 'b', count: 2, score: 3 },
    { character: 'c', count: 2, score: 4 },
    { character: 'd', count: 4, score: 1 },
    { character: 'e', count: 15, score: 1 },
    { character: 'f', count: 2, score: 4 },
    { character: 'g', count: 3, score: 2 },
    { character: 'h', count: 4, score: 2 },
    { character: 'i', count: 6, score: 1 },
    { character: 'j', count: 1, score: 6 },
    { character: 'k', count: 2, score: 4 },
    { character: 'l', count: 3, score: 2 },
    { character: 'm', count: 4, score: 3 },
    { character: 'n', count: 9, score: 1 },
    { character: 'o', count: 3, score: 2 },
    { character: 'ö', count: 1, score: 8 },
    { character: 'p', count: 1, score: 4 },
    { character: 'q', count: 1, score: 10 },
    { character: 'r', count: 6, score: 1 },
    { character: 's', count: 7, score: 1 },
    { character: 't', count: 6, score: 1 },
    { character: 'u', count: 6, score: 1 },
    { character: 'ü', count: 1, score: 6 },
    { character: 'v', count: 1, score: 6 },
    { character: 'w', count: 1, score: 3 },
    { character: 'x', count: 1, score: 8 },
    { character: 'y', count: 1, score: 10 },
    { character: 'z', count: 1, score: 3 },
  ],
});
