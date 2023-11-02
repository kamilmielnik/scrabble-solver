import { Config, Locale } from '@scrabble-solver/types';

import { scrabble } from '../games';

const roRo: Config[] = [
  new Config({
    ...scrabble,
    locale: Locale.RO_RO,
    /**
     * @see https://frsc1.fortunecity.ws/reg6scr.htm#vallit
     */
    tiles: [
      { character: 'a', count: 11, score: 1 },
      { character: 'b', count: 2, score: 9 },
      { character: 'c', count: 5, score: 1 },
      { character: 'd', count: 4, score: 2 },
      { character: 'e', count: 9, score: 1 },
      { character: 'f', count: 2, score: 8 },
      { character: 'g', count: 2, score: 9 },
      { character: 'h', count: 1, score: 10 },
      { character: 'i', count: 10, score: 1 },
      { character: 'j', count: 1, score: 10 },
      { character: 'l', count: 4, score: 1 },
      { character: 'm', count: 3, score: 4 },
      { character: 'n', count: 6, score: 1 },
      { character: 'o', count: 5, score: 1 },
      { character: 'p', count: 4, score: 2 },
      { character: 'r', count: 7, score: 1 },
      { character: 's', count: 5, score: 1 },
      { character: 't', count: 7, score: 1 },
      { character: 'u', count: 6, score: 1 },
      { character: 'v', count: 2, score: 8 },
      { character: 'x', count: 1, score: 10 },
      { character: 'z', count: 1, score: 10 },
    ],
  }),
];

export default roRo;
