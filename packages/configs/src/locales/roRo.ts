import { Config, Locale } from '@scrabble-solver/types';

import { scrabble } from '../games';

const roRo: Config[] = [
  new Config({
    ...scrabble,
    locale: Locale.RO_RO,
    tiles: [
      { character: 'a', count: 10, score: 1 },
      { character: 'b', count: 2, score: 5 },
      { character: 'c', count: 5, score: 1 },
      { character: 'd', count: 4, score: 3 },
      { character: 'e', count: 9, score: 1 },
      { character: 'f', count: 2, score: 4 },
      { character: 'g', count: 2, score: 6 },
      { character: 'h', count: 1, score: 8 },
      { character: 'i', count: 11, score: 1 },
      { character: 'j', count: 1, score: 10 },
      { character: 'l', count: 5, score: 1 },
      { character: 'm', count: 3, score: 4 },
      { character: 'n', count: 6, score: 1 },
      { character: 'o', count: 5, score: 2 },
      { character: 'p', count: 4, score: 2 },
      { character: 'r', count: 6, score: 1 },
      { character: 's', count: 6, score: 1 },
      { character: 't', count: 7, score: 1 },
      { character: 'u', count: 5, score: 1 },
      { character: 'v', count: 2, score: 4 },
      { character: 'x', count: 1, score: 10 },
      { character: 'z', count: 1, score: 8 },
    ],
  }),
];

export default roRo;
