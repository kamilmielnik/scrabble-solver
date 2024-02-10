import { Config, Locale } from '@scrabble-solver/types';

import { scrabble } from '../games';

export const spanishScrabble = new Config({
  ...scrabble,
  locale: Locale.ES_ES,
  tiles: [
    { character: 'a', count: 12, score: 1 },
    { character: 'b', count: 2, score: 3 },
    { character: 'c', count: 4, score: 3 },
    { character: 'ch', count: 1, score: 5 },
    { character: 'd', count: 5, score: 2 },
    { character: 'e', count: 12, score: 1 },
    { character: 'f', count: 1, score: 4 },
    { character: 'g', count: 2, score: 2 },
    { character: 'h', count: 2, score: 4 },
    { character: 'i', count: 6, score: 1 },
    { character: 'j', count: 1, score: 8 },
    { character: 'll', count: 1, score: 8 },
    { character: 'l', count: 4, score: 1 },
    { character: 'm', count: 2, score: 3 },
    { character: 'n', count: 5, score: 1 },
    { character: 'ñ', count: 1, score: 8 },
    { character: 'o', count: 9, score: 1 },
    { character: 'p', count: 2, score: 3 },
    { character: 'q', count: 1, score: 5 },
    { character: 'r', count: 5, score: 1 },
    { character: 'rr', count: 1, score: 8 },
    { character: 's', count: 6, score: 1 },
    { character: 't', count: 4, score: 1 },
    { character: 'u', count: 5, score: 1 },
    { character: 'v', count: 1, score: 4 },
    { character: 'x', count: 1, score: 8 },
    { character: 'y', count: 1, score: 4 },
    { character: 'z', count: 1, score: 10 },
  ],
});
