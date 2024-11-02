import { Config, Locale } from '@scrabble-solver/types';

import { kelimelik, scrabble } from '../games';

export const turkishKelimelik = new Config({
  ...kelimelik,
  locale: Locale.TR_TR,
  tiles: [
    { character: 'a', count: 12, score: 1 },
    { character: 'b', count: 2, score: 3 },
    { character: 'c', count: 2, score: 4 },
    { character: 'ç', count: 2, score: 4 },
    { character: 'd', count: 2, score: 3 },
    { character: 'e', count: 8, score: 1 },
    { character: 'f', count: 1, score: 7 },
    { character: 'g', count: 1, score: 5 },
    { character: 'ğ', count: 1, score: 8 },
    { character: 'h', count: 1, score: 5 },
    { character: 'ı', count: 4, score: 2 },
    { character: 'i', count: 7, score: 1 },
    { character: 'j', count: 1, score: 10 },
    { character: 'k', count: 7, score: 1 },
    { character: 'l', count: 7, score: 1 },
    { character: 'm', count: 4, score: 2 },
    { character: 'n', count: 5, score: 1 },
    { character: 'o', count: 3, score: 2 },
    { character: 'ö', count: 1, score: 7 },
    { character: 'p', count: 1, score: 5 },
    { character: 'r', count: 6, score: 1 },
    { character: 's', count: 3, score: 2 },
    { character: 'ş', count: 2, score: 4 },
    { character: 't', count: 5, score: 1 },
    { character: 'u', count: 3, score: 2 },
    { character: 'ü', count: 2, score: 3 },
    { character: 'v', count: 1, score: 7 },
    { character: 'y', count: 2, score: 3 },
    { character: 'z', count: 2, score: 4 },
  ],
});

export const turkishScrabble = new Config({
  ...scrabble,
  locale: Locale.TR_TR,
  tiles: [
    { character: 'a', count: 12, score: 1 },
    { character: 'b', count: 2, score: 3 },
    { character: 'c', count: 2, score: 4 },
    { character: 'ç', count: 2, score: 4 },
    { character: 'd', count: 2, score: 3 },
    { character: 'e', count: 8, score: 1 },
    { character: 'f', count: 1, score: 7 },
    { character: 'g', count: 1, score: 5 },
    { character: 'ğ', count: 1, score: 8 },
    { character: 'h', count: 1, score: 5 },
    { character: 'ı', count: 4, score: 2 },
    { character: 'i', count: 7, score: 1 },
    { character: 'j', count: 1, score: 10 },
    { character: 'k', count: 7, score: 1 },
    { character: 'l', count: 7, score: 1 },
    { character: 'm', count: 4, score: 2 },
    { character: 'n', count: 5, score: 1 },
    { character: 'o', count: 3, score: 2 },
    { character: 'ö', count: 1, score: 7 },
    { character: 'p', count: 1, score: 5 },
    { character: 'r', count: 6, score: 1 },
    { character: 's', count: 3, score: 2 },
    { character: 'ş', count: 2, score: 4 },
    { character: 't', count: 5, score: 1 },
    { character: 'u', count: 3, score: 2 },
    { character: 'ü', count: 2, score: 3 },
    { character: 'v', count: 1, score: 7 },
    { character: 'y', count: 2, score: 3 },
    { character: 'z', count: 2, score: 4 },
  ],
});