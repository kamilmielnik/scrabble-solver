import { Config, Locale } from '@scrabble-solver/types';

import { scrabble } from '../games';

export const frenchScrabble = new Config({
  ...scrabble,
  locale: Locale.FR_FR,
  tiles: [
    { character: 'a', count: 9, score: 1 },
    { character: 'b', count: 2, score: 3 },
    { character: 'c', count: 2, score: 3 },
    { character: 'd', count: 3, score: 2 },
    { character: 'e', count: 15, score: 1 },
    { character: 'f', count: 2, score: 4 },
    { character: 'g', count: 2, score: 2 },
    { character: 'h', count: 2, score: 4 },
    { character: 'i', count: 8, score: 1 },
    { character: 'j', count: 1, score: 8 },
    { character: 'k', count: 1, score: 10 },
    { character: 'l', count: 5, score: 1 },
    { character: 'm', count: 3, score: 2 },
    { character: 'n', count: 6, score: 1 },
    { character: 'o', count: 6, score: 1 },
    { character: 'p', count: 2, score: 3 },
    { character: 'q', count: 1, score: 8 },
    { character: 'r', count: 6, score: 1 },
    { character: 's', count: 6, score: 1 },
    { character: 't', count: 6, score: 1 },
    { character: 'u', count: 6, score: 1 },
    { character: 'v', count: 2, score: 4 },
    { character: 'w', count: 1, score: 10 },
    { character: 'x', count: 1, score: 10 },
    { character: 'y', count: 1, score: 10 },
    { character: 'z', count: 1, score: 10 },
  ],
});
