import { Config } from '@scrabble-solver/models';

import base from './base';

export default Config.fromJson({
  ...base,
  tiles: [
    { character: 'a', score: 1, count: 9 },
    { character: 'b', score: 3, count: 2 },
    { character: 'c', score: 3, count: 2 },
    { character: 'd', score: 2, count: 4 },
    { character: 'e', score: 1, count: 12 },
    { character: 'f', score: 4, count: 2 },
    { character: 'g', score: 2, count: 3 },
    { character: 'h', score: 4, count: 2 },
    { character: 'i', score: 1, count: 9 },
    { character: 'j', score: 8, count: 1 },
    { character: 'k', score: 5, count: 1 },
    { character: 'l', score: 1, count: 4 },
    { character: 'm', score: 3, count: 2 },
    { character: 'n', score: 1, count: 6 },
    { character: 'o', score: 1, count: 8 },
    { character: 'p', score: 3, count: 2 },
    { character: 'q', score: 10, count: 1 },
    { character: 'r', score: 1, count: 6 },
    { character: 's', score: 1, count: 4 },
    { character: 't', score: 1, count: 6 },
    { character: 'u', score: 1, count: 4 },
    { character: 'v', score: 4, count: 2 },
    { character: 'w', score: 4, count: 2 },
    { character: 'x', score: 8, count: 1 },
    { character: 'y', score: 4, count: 2 },
    { character: 'z', score: 10, count: 1 }
  ]
});
